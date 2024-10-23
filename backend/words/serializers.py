from rest_framework import serializers

from words.models import KoreanWord, Sense, HanjaCharacter

# Serializer for Korean words as they appear in the list of search results
class KoreanWordSearchResultSerializer(serializers.ModelSerializer):
  target_code = serializers.IntegerField()
  word = serializers.CharField()
  origin = serializers.CharField()
  word_type = serializers.CharField()
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

class SimplifiedSenseSerializer(serializers.ModelSerializer):
  target_code = serializers.IntegerField()
  definition = serializers.CharField()
  type = serializers.CharField()
  order = serializers.IntegerField()
  category = serializers.CharField()
  pos = serializers.CharField()

  class Meta:
    model = Sense
    fields = ['target_code', 'definition', 'type', 'order', 
              'category', 'pos']
    read_only_fields = ['__all__']