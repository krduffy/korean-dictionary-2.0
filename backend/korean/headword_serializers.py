from rest_framework import serializers
from korean.sense_serializers import (
    SimplifiedSenseSerializer,
)
from korean.models import KoreanHeadword


# Mixings for getting user data.
class GetKoreanHeadwordUserDataMixin:

    def get_user_data(self, obj):

        request = self.context.get("request")
        user = request.user
        if not user.is_authenticated:
            return None

        user_data = dict()
        user_data["is_known"] = user.known_headwords.filter(pk=obj.target_code).exists()
        user_data["is_studied"] = user.studied_headwords.filter(
            pk=obj.target_code
        ).exists()
        return user_data


# Base for all Korean word serializers
# Has pk, word, origin, user data.
class BaseKoreanHeadwordSerializer(
    serializers.ModelSerializer, GetKoreanHeadwordUserDataMixin
):
    user_data = serializers.SerializerMethodField()

    class Meta:
        model = KoreanHeadword
        fields = ["target_code", "word", "origin", "user_data", "result_ranking"]
        read_only_fields = ["__all__"]


# Serializer for Korean words as they appear in the list of search results
class KoreanHeadwordSearchResultSerializer(BaseKoreanHeadwordSerializer):
    senses = SimplifiedSenseSerializer(source="first_five_senses", many=True)

    class Meta(BaseKoreanHeadwordSerializer.Meta):
        fields = BaseKoreanHeadwordSerializer.Meta.fields + ["word_type", "senses"]


# Serializer for Korean words as they appear under Hanja popup views.
class KoreanHeadwordInHanjaCharacterPopupViewSerializer(BaseKoreanHeadwordSerializer):
    pass
    # can add more fields later (?)


class KoreanHeadwordAsExampleSerializer(BaseKoreanHeadwordSerializer):
    first_sense = SimplifiedSenseSerializer()

    class Meta(BaseKoreanHeadwordSerializer.Meta):
        fields = BaseKoreanHeadwordSerializer.Meta.fields + ["first_sense"]
