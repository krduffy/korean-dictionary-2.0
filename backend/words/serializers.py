from rest_framework import serializers

from words.models import KoreanWord, Sense, HanjaCharacter
from words.queryset_operations import get_ordered_hanja_example_queryset

# Mixings for getting user data.
class GetKoreanWordUserDataMixin:

  def get_user_data(self, obj):

    user = self.context['request'].user

    if user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = user.known_words.filter(pk = obj.target_code).exists()
      user_data['is_studied'] = user.studied_words.filter(pk = obj.target_code).exists()
      return user_data
    else:
      return None

class GetHanjaCharacterUserDataMixin:

  def get_user_data(self, obj):
    user = self.context['request'].user

    if user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = user.known_hanja.filter(pk = obj.character).exists()
      user_data['is_studied'] = user.studied_hanja.filter(pk = obj.character).exists()
      return user_data
    else:
      return None

# Base for all Korean word serializers
# Has pk, word, origin, user data.
class BaseKoreanWordSerializer(serializers.ModelSerializer, GetKoreanWordUserDataMixin):
  user_data = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin', 'user_data']
    read_only_fields = ['__all__']

# Serializer for Korean words as they appear in the list of search results
class KoreanWordSearchResultSerializer(BaseKoreanWordSerializer):
  senses = serializers.SerializerMethodField()

  class Meta(BaseKoreanWordSerializer.Meta):
    fields = BaseKoreanWordSerializer.Meta.fields + ['word_type', 'senses']

  def get_senses(self, obj):
    first_five = obj.senses.all().order_by('order')[:5]
    sense_serializer = SimplifiedSenseSerializer(first_five, many=True)
    return sense_serializer.data

# Serializer for Korean words as they appear in detailed view screens.
class KoreanWordDetailedSerializer(BaseKoreanWordSerializer):
  senses = serializers.SerializerMethodField()

  class Meta(BaseKoreanWordSerializer.Meta):
    fields = BaseKoreanWordSerializer.Meta.fields + ['word_type', 'history_info', 'senses']

  def get_senses(self, obj):
    all_senses = obj.senses.all().order_by('order')
    sense_serializer = DetailedSenseSerializer(all_senses, many=True)
    return sense_serializer.data

# Serializer for senses as they are listed under Korean word search results.
class SimplifiedSenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sense
    fields = ['target_code', 'definition', 'type', 'order', 
              'category', 'pos']
    read_only_fields = ['__all__']

# Serializer for senses as they are listed under Korean word detail views.
class DetailedSenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sense
    fields = ['target_code', 'definition', 'type', 'order', 
              'category', 'pos', 'additional_info']
    read_only_fields = ['__all__']

# Serializer for Korean words as they appear under Hanja popup views.
class KoreanWordInHanjaCharacterPopupViewSerializer(BaseKoreanWordSerializer):
  pass
  # can add more fields later (?)

class KoreanWordHanjaExampleSenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sense
    fields = ['target_code', 'order', 'definition']
    read_only_fields = ['__all__']

class KoreanWordInHanjaExamplesViewSerializer(BaseKoreanWordSerializer):
  first_sense = serializers.SerializerMethodField()

  class Meta(BaseKoreanWordSerializer.Meta):
    fields = BaseKoreanWordSerializer.Meta.fields + ['first_sense']
  
  def get_first_sense(self, obj):
    first = obj.senses.all().order_by('order')[0]
    sense_serializer = KoreanWordHanjaExampleSenseSerializer(first)
    return sense_serializer.data
  
# Base serializer for Hanja characters.
# has common fields of character, user_data, and meaning_readings
class BaseHanjaCharacterSerializer(serializers.ModelSerializer, GetHanjaCharacterUserDataMixin):
  user_data = serializers.SerializerMethodField()
  meaning_readings = serializers.SerializerMethodField()

  class Meta:
    model = HanjaCharacter
    fields = ['character', 'user_data', 'meaning_readings']
    read_only_fields = ['__all__']
  
  def get_meaning_readings(self, obj):
    meaning_readings = obj.meaning_readings.all()
    
    return [
      {
        "meaning": meaning_reading.meaning,
        "readings": [char for char in meaning_reading.readings]
      }
      for meaning_reading in meaning_readings
    ]

# Serializer for Hanja characters as they appear in search results
class HanjaCharacterSearchResultSerializer(BaseHanjaCharacterSerializer):
  class Meta(BaseHanjaCharacterSerializer.Meta):
    fields = BaseHanjaCharacterSerializer.Meta.fields \
                        + ['strokes', 'grade_level', 
                           'exam_level', 'explanation']

# Serializer for Hanja character as they appear in Hanja detail view screens.
class HanjaCharacterDetailedSerializer(BaseHanjaCharacterSerializer):
  class Meta(BaseHanjaCharacterSerializer.Meta):
    fields = BaseHanjaCharacterSerializer.Meta.fields \
                      + ['strokes', 'grade_level', 'exam_level', 
                         'explanation', 'decomposition', 'radical', 'radical_source']
  
# Serializer for Hanja characters as they appear in Hanja popup views.
class HanjaCharacterPopupViewSerializer(BaseHanjaCharacterSerializer):
  word_results = serializers.SerializerMethodField()

  class Meta(BaseHanjaCharacterSerializer.Meta):
    fields = BaseHanjaCharacterSerializer.Meta.fields + ['word_results']

  def get_word_results(self, obj):
    user = self.context['request'].user
    queryset = KoreanWord.objects.all().filter(origin__icontains = obj.character)
    ordered_queryset = get_ordered_hanja_example_queryset(queryset, user)

    num_results = 10
    korean_word_serializer = \
      KoreanWordInHanjaCharacterPopupViewSerializer(ordered_queryset[:num_results], 
                                                    many=True, context=self.context)
    
    return korean_word_serializer.data