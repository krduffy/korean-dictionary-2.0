import copy
import re
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response

from words.models import KoreanWord

from konlpy.tag import Kkma

kkma = Kkma()

def get_found_response(found_word):
  return Response(
    {"found": found_word},
    status = status.HTTP_200_OK
  )

def get_failure_response():
  return Response(
    {"detail": "A word was not found."},
    status=status.HTTP_404_NOT_FOUND
  )

# Returns the nouns and verbs in a sentence, as analyzed by Kkma (from the konlpy library).
def get_nouns_verbs(sentence):
  """
    A function to get nouns and verb lemmas from a given sentence.
    
    Parameters:
      - `sentence`: The sentence from which to extract nouns and verbs

    Returns: A tuple containing:
      - The list of nouns and verbs in the first position.
      - The list of all lemmas in the sentence in the second position.
  """
  def accept_pos(str):
    return str.startswith("N") or str.startswith("V") or str.startswith("M") or str == "XR" or str == "XSA" or str == "OL"
  
  def is_어근_followed_by_deriv_suffix(str1, str2):
    return (str1 == "XR" or str1 == 'NNG') and str2 == "XSA"

  analysis = kkma.pos(sentence)

  accepted_lemmas = [item for item in analysis if accept_pos(item[1])]
  num_accepted_lemmas = len(accepted_lemmas)
  return_list = []

  for i in range(0, num_accepted_lemmas):
    
    if i != (num_accepted_lemmas - 1) and \
              is_어근_followed_by_deriv_suffix(accepted_lemmas[i][1], accepted_lemmas[i+1][1]):

      return_list.append((accepted_lemmas[i][0] + accepted_lemmas[i+1][0], 'V'))
    
    elif not accepted_lemmas[i][1] == 'XSA':
      return_list.append(accepted_lemmas[i])

  return (return_list, analysis)

# this is called to ensure that if something like 공자(孔子) the analysis will return
# 孔子 instead of 공자 in general. Because there are so many 동음이의어 in korean, this
# is more convenient for the user so that they do not have to scroll through results
# to get to the correct one if the string itself specifies a hanja origin.
def get_hanja_if_in_original(found_word, original_string):
  # 1 or more hanja characters surrounded by parentheses
  regex = r'\([\u4e00-\u9fff]+\)'

  pattern = re.compile(regex)

  match = pattern.search(original_string)
  if match:
    # start from 1, end at -1 to remove parentheses
    hanja_word = match.group()[1:-1]
    if KoreanWord.objects.filter(word__exact = found_word).filter(origin__exact = hanja_word).exists():
      return get_found_response(hanja_word)
    
  return None

class NLPRequestValidator(serializers.Serializer):
  sentence = serializers.CharField(required = True, max_length = 500)
  mouse_over = serializers.CharField(required = True, max_length = 100)

  def validate(self, attrs):
    sentence = attrs['sentence']
    mouse_over = attrs['mouse_over']

    sentence_tokens = sentence.split()
    print(sentence_tokens)
    print(mouse_over)
    if mouse_over not in sentence_tokens:
      raise serializers.ValidationError("mouse_over must be a token in the sentence provided.")

    return super().validate(attrs)

class KoreanWordAnalyze(APIView):
  """
    API view to return the lemma for a given word in a given text. Can also return an incorrect lemma.

    POST body keys:
      - `text`: The full text.
      - `mouse_over`: The word from text whose lemma should be returned.

    Returns:
      A JSON dictionary containing:

      On Success:
        - `found`: The lemma corresponding to `mouse_over`.
        - `num_words`: The number of words the model found in `text`.
        - `analysis`: All of the lemmas the model found in `text`.
        
      On Failure:
        - `error`: The encountered error.
  """
  serializer_class = NLPRequestValidator

  def post(self, request):

    serializer = self.serializer_class(data = request.data)
    if not serializer.is_valid():
      return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

    sentence = request.data['sentence']
    mouse_over = request.data['mouse_over']
    original_inner_strings = sentence.split()
    new_sentence_strings = original_inner_strings

    # ~~~~ ADDING DUMMIES ~~~~

    delimiting_pairs = [('‘', '’')]
    # checks for strings with no whitespace and both of the things in a delimiting pair
    regex = '|'.join(f'(?:{re.escape(start)}' + r'[^\s]' + f'+?{re.escape(end)})'
                      for start, end in delimiting_pairs)
    pattern = re.compile(regex)

    (analysis, original) = ([], [])

    needs_dummy = pattern.match(sentence)

    if needs_dummy:
      original_inner_strings = sentence.split()
      new_sentence_strings = copy.deepcopy(original_inner_strings)
      # this dummy string will get tagged as OL (other language).
      # thus, I check if a thing to be returned starts with this string
      # if it does, we will instead return the original string.
      # This is necessary because the model cannot handle things like
      # '\'살다\'의 피동사' well due to the apostrophes. However, these kinds of
      # definitions are so common that it is beneficial to have this additional
      # line of defense against returning no string
      dummy_string = 'Kieran'
      number_words = ['zero', 'one', 'two', 'three', 'four', 'five']
      num_dummies = 0
      
      for i in range(0, len(original_inner_strings)):
        found = pattern.match(original_inner_strings[i])
        if found:
          original_inner_strings[i] = found.group()[1:-1]
          new_sentence_strings[i] = new_sentence_strings[i].replace(found.group(), dummy_string + number_words[num_dummies])
          num_dummies += 1

      new_sentence = "".join(string for string in new_sentence_strings)

      (analysis, original) = get_nouns_verbs(new_sentence)
    else:
      (analysis, original) = get_nouns_verbs(sentence)

    # this is a heuristic but it is correct almost every time from testing
    # with sentence strings that contain hanja, very long sentences, several 조사 all
    # glued together, etc. If I find that it is unsatisfyingly inaccurate then I will make
    # changes but this feature of clicking on words will need to be toggled anyway ( there will
    # be a disclaimer about potential inaccuracies) so this is what I will be using for the time
    # being.
    if len(analysis) == len(sentence.split()):
      index_of_mouse_over = sentence.split().index(mouse_over)

      return_word = analysis[index_of_mouse_over][0]
      word_type = analysis[index_of_mouse_over][1]

      if needs_dummy and return_word.startswith(dummy_string):
        return_word = original_inner_strings[
          number_words.index(return_word.replace(dummy_string, ''))
        ]
      
      hanja = get_hanja_if_in_original(return_word, mouse_over)

      if hanja:
        return get_found_response(hanja)
      else:
        return get_found_response(return_word 
                                  + "다" if not needs_dummy and word_type.startswith('V')
                                  else return_word)
  
    # Usually only gets as a last resort. Verbs rarely found here because they never contain
    # '다' in the verb itself. However, there is another problem with changes such as 보다 ->
    # 봤어요 where even if it only checks that 봤어요 starts with 보, it will not be found because
    # things ending in ㅜ, ㅗ, ㅡ, ㅣ, etc often change to ㅝ, ㅘ, ㅓ, ㅕ. Additionally the ㅆ as 받침
    # makes finding verbs difficult here.

    # can also look for the longest string that matches so 원자량 matches 원자량 instead of 원자 etc
    for word in analysis:
      if mouse_over.startswith(word):
        hanja = get_hanja_if_in_original(word[0], mouse_over)

        if hanja:
          return get_found_response(hanja)
        else:
          return get_found_response(word[0] 
                                    + "다" if word[1].startswith('V') 
                                    else word[0])

    return get_failure_response()