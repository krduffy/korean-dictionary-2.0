from rest_framework import serializers

from words.models import KoreanWord, Sense, HanjaCharacter

# Serializer for Korean words as they appear in the list of search results
class KoreanWordSearchResultSerializer(serializers.ModelSerializer):
  senses = serializers.SerializerMethodField()
  user_data = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin', 'word_type', 
              'senses', 'user_data']
    read_only_fields = ['__all__']

  def get_user_data(self, obj):
    user = self.context['request'].user

    if user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = user.known_words.filter(pk = obj.target_code).exists()
      user_data['is_studied'] = user.studied_words.filter(pk = obj.target_code).exists()
      return user_data
    else:
      return None

  def get_senses(self, obj):
    first_five = obj.senses.all().order_by('order')[:5]
    sense_serializer = SimplifiedSenseSerializer(first_five, many=True)
    return sense_serializer.data

class KoreanWordDetailedSerializer(serializers.ModelSerializer):
  senses = serializers.SerializerMethodField()
  user_data = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin', 'word_type', 'history_info',
              'senses', 'user_data']
    read_only_fields = ['__all__']

  def get_user_data(self, obj):
    user = self.context['request'].user

    if user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = user.known_words.filter(pk = obj.target_code).exists()
      user_data['is_studied'] = user.studied_words.filter(pk = obj.target_code).exists()
      return user_data
    else:
      return None

  def get_senses(self, obj):
    all_senses = obj.senses.all().order_by('order')
    sense_serializer = DetailedSenseSerializer(all_senses, many=True)
    return sense_serializer.data

class SimplifiedSenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sense
    fields = ['target_code', 'definition', 'type', 'order', 
              'category', 'pos', 'additional_info']
    read_only_fields = ['__all__']

class DetailedSenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sense
    fields = ['target_code', 'definition', 'type', 'order', 
              'category', 'pos', 'additional_info']
    read_only_fields = ['__all__']

class HanjaCharacterSearchResultSerializer(serializers.ModelSerializer):
  
  user_data = serializers.SerializerMethodField()
  meaning_readings = serializers.SerializerMethodField()

  class Meta:
    model = HanjaCharacter
    fields = ('character', 'strokes', 'grade_level', 'exam_level', 'explanation', 'user_data', 'meaning_readings')
    read_only_fields = ['__all__']

  def get_user_data(self, obj):
    user = self.context['request'].user

    if user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = user.known_hanja.filter(pk = obj.character).exists()
      user_data['is_studied'] = user.studied_hanja.filter(pk = obj.character).exists()
      return user_data
    else:
      return None
  
  def get_meaning_readings(self, obj):
    meaning_readings = obj.meaning_readings.all()
    
    return [
      {
        "meaning": meaning_reading.meaning,
        "readings": [char for char in meaning_reading.readings]
      }
      for meaning_reading in meaning_readings
    ]
  
class HanjaCharacterDetailedSerializer(serializers.ModelSerializer):
  user_data = serializers.SerializerMethodField()
  meaning_readings = serializers.SerializerMethodField()

  class Meta:
    model = HanjaCharacter
    fields = ('character', 'strokes', 'grade_level', 'exam_level', 'explanation', 
              'decomposition', 'radical', 'radical_source', 'user_data', 'meaning_readings')
    read_only_fields = ['__all__']

  def get_user_data(self, obj):
    user = self.context['request'].user

    if user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = user.known_hanja.filter(pk = obj.character).exists()
      user_data['is_studied'] = user.studied_hanja.filter(pk = obj.character).exists()
      return user_data
    else:
      return None
  
  def get_meaning_readings(self, obj):
    meaning_readings = obj.meaning_readings.all()
    
    return [
      {
        "meaning": meaning_reading.meaning,
        "readings": [char for char in meaning_reading.readings]
      }
      for meaning_reading in meaning_readings
    ]