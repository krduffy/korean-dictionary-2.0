
import json
import os
from pathlib import Path
from django.contrib.auth import get_user_model
from words.models import HanjaCharacter, HanjaMeaningReading, KoreanWord, Sense

User = get_user_model()

class DbDataManager:
  """Manages creation and access of test data across test suites"""

  @classmethod
  def load_json_fixture(cls, filename):
    """Loads test data from a JSON file"""
    file_path = 'words\\tests\\fixtures\\data\\' + filename
    with open(file_path, 'r', encoding='utf-8') as f:
      return json.load(f)

  @classmethod
  def create_hanja_characters(cls):
    """Creates test Hanja characters from JSON fixture"""
    characters = cls.load_json_fixture('db_data.json')['character_data']
    created_chars = {}

    for data in characters:
      hanja = HanjaCharacter.objects.create(
        character=data['character'],
        decomposition=data['decomposition'],
        radical=data['radical'],
        strokes=data['strokes'],
        grade_level=data['grade_level'],
        exam_level=data['exam_level'],
        result_ranking=data['result_ranking'],
        explanation=data['explanation']
      )
      for meaning_reading in data['meaning_readings']:
        HanjaMeaningReading.objects.create(
          referent=hanja,
          meaning=meaning_reading['meaning'],
          readings=meaning_reading['readings']
        )
      
      created_chars[data['character']] = hanja
      
    return created_chars

  @classmethod
  def create_base_user(cls):
    """Creates a standard test user"""
    return User.objects.create_user(
      username='testuser',
      password='testpassword123'
    )
  
  @classmethod
  def create_staff(cls):
    """Creates a staff member."""
    return User.objects.create_user(
      username='staffuser',
      password='password123',
      is_staff=True,
    )

  @classmethod
  def create_korean_words(cls):
    """Creates test Korean words from JSON fixture"""
    korean_word_data = cls.load_json_fixture('db_data.json')['word_data']
    created_words = {}
    
    for word_data in korean_word_data:
      word = KoreanWord.objects.create(
          target_code=word_data['target_code'],
          word=word_data['word'],
          origin=word_data['origin'],
          word_type=word_data['word_type'],
          history_info=word_data['history_info']
      )
      
      for sense_data in word_data['senses']:
        Sense.objects.create(
          referent=word,
          target_code=sense_data['target_code'],
          definition=sense_data['definition'],
          type=sense_data['type'],
          order=sense_data['order'],
          category=sense_data['category'],
          pos=sense_data['pos'],
          additional_info=sense_data['additional_info']
        )
      
      created_words[word_data['target_code']] = word
        
    return created_words

  @classmethod
  def create_all_test_data(cls):
    """Creates all test data including words, hanja characters, and users"""
    hanja_chars = cls.create_hanja_characters()
    korean_words = cls.create_korean_words()
    user = cls.create_base_user()
    staff = cls.create_staff()
    
    return {
      'hanja_characters': hanja_chars,
      'korean_words': korean_words,
      'regular_user': user,
      'staff': staff,
    }