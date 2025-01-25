from rest_framework import serializers

from korean.serializers import (
    KoreanHeadwordInHanjaCharacterPopupViewSerializer,
)
from hanja.models import HanjaCharacter
from korean.models import KoreanHeadword
from hanja.get_queryset import get_ordered_hanja_example_queryset


class GetHanjaCharacterUserDataMixin:

    def get_user_data(self, obj):
        user = self.context["request"].user

        if user.is_authenticated:
            user_data = dict()
            user_data["is_known"] = user.known_hanja.filter(pk=obj.character).exists()
            user_data["is_studied"] = user.studied_hanja.filter(
                pk=obj.character
            ).exists()
            return user_data
        else:
            return None


# Base serializer for Hanja characters.
# has common fields of character, user_data, and meaning_readings
class BaseHanjaCharacterSerializer(
    serializers.ModelSerializer, GetHanjaCharacterUserDataMixin
):
    user_data = serializers.SerializerMethodField()
    meaning_readings = serializers.SerializerMethodField()

    class Meta:
        model = HanjaCharacter
        fields = ["character", "user_data", "meaning_readings", "result_ranking"]
        read_only_fields = ["__all__"]

    def get_meaning_readings(self, obj):
        meaning_readings = obj.meaning_readings.all()

        return [
            {
                "meaning": meaning_reading.meaning,
                "readings": [char for char in meaning_reading.readings],
            }
            for meaning_reading in meaning_readings
        ]


# Serializer for Hanja characters as they appear in search results
class HanjaCharacterSearchResultSerializer(BaseHanjaCharacterSerializer):
    class Meta(BaseHanjaCharacterSerializer.Meta):
        fields = BaseHanjaCharacterSerializer.Meta.fields + [
            "strokes",
            "grade_level",
            "exam_level",
            "explanation",
        ]


# Serializer for Hanja character as they appear in Hanja detail view screens.
class HanjaCharacterDetailedSerializer(BaseHanjaCharacterSerializer):
    class Meta(BaseHanjaCharacterSerializer.Meta):
        fields = BaseHanjaCharacterSerializer.Meta.fields + [
            "strokes",
            "grade_level",
            "exam_level",
            "explanation",
            "decomposition",
            "radical",
            "radical_source",
        ]


# Serializer for Hanja characters as they appear in Hanja popup views.
class HanjaCharacterPopupViewSerializer(BaseHanjaCharacterSerializer):
    word_results = serializers.SerializerMethodField()

    class Meta(BaseHanjaCharacterSerializer.Meta):
        fields = BaseHanjaCharacterSerializer.Meta.fields + ["word_results"]

    def get_word_results(self, obj):
        user = self.context["request"].user
        queryset = KoreanHeadword.objects.all().filter(origin__icontains=obj.character)
        ordered_queryset = get_ordered_hanja_example_queryset(queryset, user)

        num_results = 10
        korean_word_serializer = KoreanHeadwordInHanjaCharacterPopupViewSerializer(
            ordered_queryset[:num_results], many=True, context=self.context
        )

        return korean_word_serializer.data
