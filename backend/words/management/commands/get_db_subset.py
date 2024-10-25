from django.core.management.base import BaseCommand, no_translations
from words.models import KoreanWord, HanjaCharacter
import django

from django.db.models.functions import Length

import json

django.setup()

def get_dictionary_for_korean_word(kw: KoreanWord):
  return {
    "target_code": kw.target_code,
    "word": kw.word,
    "origin": kw.origin,
    "word_type": kw.word_type,
    "history_info": kw.history_info,
    "senses": [
      {
        "target_code": s.target_code,
        "definition": s.definition,
        "type": s.type,
        "order": s.order,
        "category": s.category,
        "pos": s.pos,
        "additional_info": s.additional_info
      }
      for s in kw.senses.all()
    ]
  }

def get_dictionary_for_hanja_char(hc: HanjaCharacter):
  return {
    "character": hc.character,
    "decomposition": hc.decomposition,
    "radical": hc.radical,
    "radical_source": hc.radical_source,
    "strokes": hc.strokes,
    "grade_level": hc.grade_level,
    "exam_level": hc.exam_level,
    "result_ranking": hc.result_ranking,
    "explanation": hc.explanation,
    "meaning_readings": [
        {
            "meaning": mr.meaning,
            "readings": mr.readings
        }
        for mr in hc.meaning_readings.all()
    ]
  }

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):

    max_word_length = 2

    words = KoreanWord.objects.all() \
                              .filter(word__icontains = '가') \
                              .annotate(length = Length('word')) \
                              .filter(length__lte = max_word_length) \
                              .order_by('pk')[:6] \
                              .prefetch_related('senses')
    characters = [
      HanjaCharacter.objects.all().filter(pk=char).first()
      for char in ['金', '兔', '禁', '元', '狙', '女']
    ]

    word_data = [get_dictionary_for_korean_word(x) for x in words]
    character_data = [get_dictionary_for_hanja_char(x) for x in characters]

    json_data = {
      "word_data": word_data,
      "character_data": character_data
    }

    output_file = "words\\tests\\fixtures\\data\\db_data.json"
    with open(output_file, 'w+', encoding='utf-8') as file:
      file.write(json.dumps(json_data, ensure_ascii=False, indent=4))