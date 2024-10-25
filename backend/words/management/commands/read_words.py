from django.core.management.base import BaseCommand, CommandError, CommandParser, no_translations
from words.models import KoreanWord, Sense
import os
import django
import json
import re
import html

django.setup()

class Command(BaseCommand):

  def add_arguments(self, parser: CommandParser) -> None:
    parser.add_argument('--drop', action='store_true', help='Drops all KoreanWords and Senses before execution.')
    parser.add_argument('fname', type=str, help='Indicates which file should be added. Use \'all\' for all files.)')
  
  @no_translations
  def handle(self, *args, **kwargs):

    drop_all = kwargs['drop']

    if drop_all:
      KoreanWord.objects.all().delete()
      Sense.objects.all().delete()
      self.stdout.write('Dropped all KoreanWords and Senses.')

    dict_dir = "words\\management\\dictionary_data\\우리말샘"
    json_files = []
    BATCH_SIZE = 5000
    batches_added = 0

    file = kwargs['fname']
    if not file:
      raise CommandError('You must supply a file name for execution.')
    if file == 'all':
      json_files = [os.path.join(dict_dir, fileindir) for fileindir in os.listdir(dict_dir)]
    else:
      json_files.append(file)

    senses_to_add = []

    for dict_file in json_files:
      with open(dict_file, mode='r', encoding='utf-8') as raw_file:
        dict_json = json.load(raw_file)
        
        for sense_structure in dict_json["channel"]["item"]:
          sense = get_as_sense(sense_structure)
          if sense:
            senses_to_add.append(sense)
          
          if len(senses_to_add) >= BATCH_SIZE:
            Sense.objects.bulk_create(senses_to_add)
            batches_added += 1
            self.stdout.write(f'Created {len(senses_to_add)} senses in bulk. (cumulative {BATCH_SIZE * batches_added})')

            senses_to_add = []

    if senses_to_add:
      Sense.objects.bulk_create(senses_to_add)
      self.stdout.write(f'Created {len(senses_to_add)} senses in bulk. ' +
                        f'(cumulative {BATCH_SIZE * batches_added + len(senses_to_add)})')

    # Now that they have all been read in.
    if file == 'all':
      # For relation_info:
      # 1. delete 001, 002 etc numbers at end of word string and remove ^ and -
      # 2. change target_code of word from its sense target code to the word's target code
      # 3. remove link (unused).
      
      senses_to_update = []

      for sense in Sense.objects.all():

        changed = False

        if "relation_info" in sense.additional_info and sense.additional_info["relation_info"]:
          
          for relinfo in sense.additional_info["relation_info"]:
            relinfo["word"] = relinfo.get("word", "").replace("-", "").replace("^", "")[:-3]
            try:
              relinfo["link_target_code"] = Sense.objects.get(target_code=relinfo["link_target_code"]).referent.pk
            except Sense.DoesNotExist:
              relinfo.pop("link_target_code", None)
            relinfo.pop("link", None)

          changed = True
            
        # For proverb info:
        # 1. Change target code as above.
        # 2. Remove link as above.
        if "proverb_info" in sense.additional_info and sense.additional_info["proverb_info"]:
          for provinfo in sense.additional_info["proverb_info"]:
            try:
              provinfo["link_target_code"] = Sense.objects.get(target_code=provinfo["link_target_code"]).referent.pk
            except Sense.DoesNotExist:
              provinfo.pop("link_target_code", None)
            provinfo.pop("link", None)
          
          changed = True

        if changed:
          senses_to_update.append(sense)
        
      Sense.objects.bulk_update(senses_to_update, ['additional_info'], batch_size=BATCH_SIZE)

    self.stdout.write(self.style.SUCCESS('Successfully finished executing command'))

# Recursively changes everything in the obj passed in (a channelitem dictionary).
# Currently unescapes strings to allow for < instead of &lt;
# and removes any <img> tags.
def recursively_clean_channelitem(obj):
    if isinstance(obj, dict):
        return {key: recursively_clean_channelitem(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [recursively_clean_channelitem(item) for item in obj]
    elif isinstance(obj, str):
        # Tags that need their inner text preserved but the html tags removed
        # So "<strong>word</strong>" becomes "word" etc.
        deleted_html_patterns = [
          '<I>', '</I>', '<sub>', '</sub>', '<sup>', '</sup>', '<IN>', '</IN>',
          '<span class="korean-webfont">', '<span class="ngullim">', '</span>', '<FL>', '</FL>', 
          '<strong>', '</strong>', '<i>', '</i>'
        ]
        new_str = str
        for pattern in deleted_html_patterns:
          new_str = obj.replace(pattern, '')

        # Html tags that require re module
        new_str = re.sub(r'<sense_no>\d*</sense_no>', '', new_str)
        new_str = re.sub(r'<img\b[^>]*>', '', new_str)
        
        # Getting rid of potentially excessive spacing resulting from previous deletions
        new_str = re.sub(r'\s+', ' ', new_str)

        return html.unescape(new_str)
    else:
        return obj

# channel_item follows the general structure of ./json_structure.txt
def get_as_sense(channel_item):

  channel_item = recursively_clean_channelitem(channel_item)

  # make new word if this sense's referent does not yet exist
  word_ref_target_code: int = channel_item["group_code"]
  wordinfo = channel_item["wordinfo"]
  
  senseinfo = channel_item["senseinfo"]
  history_info = senseinfo.get("history_info", None)
  
  ret: int = add_word(wordinfo, word_ref_target_code, history_info)
  if ret == -1:
    return

  sense_target_code: int = channel_item["target_code"]
  sense_referent: KoreanWord = KoreanWord.objects.get(target_code = word_ref_target_code)

  sense_def = senseinfo["definition"]
  sense_type = senseinfo["type"]
  sense_order = channel_item["group_order"]
  sense_category = senseinfo.get("cat_info", "")
  if sense_category:
    sense_category = sense_category[0]["cat"]
    # now string
  sense_pos = senseinfo.get("pos", "")
  
  # Additional information to be stored in the json field.
  additional_info_choices = ["pattern_info", "relation_info", "example_info", "norm_info", 
                             "grammar_info", "proverb_info", "region_info"]
  additional_info_or_none = {info: senseinfo.get(info, None) for info in additional_info_choices}

  sense_additional_info = {info_key: info_value for 
                           info_key, info_value in additional_info_or_none.items() 
                           if info_value is not None}

  if '<DR />' in sense_def:
    try:
      sense_def = sense_def.replace(
        "<DR />",
        "(" + ", ".join(region_dict['region'] for region_dict in sense_additional_info['region_info']) + ").",
      )
    except:
      pass

  new_sense = Sense(target_code = sense_target_code, 
                    referent = sense_referent, 
                    definition = sense_def, 
                    type = sense_type, 
                    order = sense_order, 
                    category = sense_category, 
                    pos = sense_pos, 
                    additional_info = sense_additional_info)
  return new_sense
  
# Returns 0 if word was added successfully.
# Returns 1 if word is already in the database.
# Returns -1 if word is too long (> 16 characters). Dictionary contains a large number of
# things I wouldn't consider atomic "words". (names of governmental policies that are nearly 
# entire sentences, etc)
def add_word(wordinfo: dict, word_target_code: int, history_info: dict | None) -> int:

  if KoreanWord.objects.filter(target_code = word_target_code).exists():
    return 1

  originlang_info = wordinfo.get("original_language_info", None)
    
  # If here, word needs to be added and return 0
  word: str = wordinfo["word"].replace("-", "").replace("^", "")
  if len(word) > 16:
    return -1
  
  word_type: str = wordinfo["word_unit"]
  origin: str = ""
  if originlang_info:
    for pair in originlang_info:
      origin += pair["original_language"]

  new_word = KoreanWord(target_code = word_target_code, 
                        word = word, 
                        origin = origin, 
                        word_type = word_type,
                        history_info = history_info)
  new_word.save()
  return 0