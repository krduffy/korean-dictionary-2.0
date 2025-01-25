from rest_framework import serializers

from korean.models import KoreanHeadword, Sense, SenseExample
from user_examples.serializers import (
    DerivedExampleLemmaSearchResultSerializer,
    UserExampleSentenceSerializer,
    UserImageSerializer,
    UserVideoExampleSerializer,
)


# Mixings for getting user data.
class GetKoreanHeadwordUserDataMixin:

    def get_user_data(self, obj):

        user = self.context["request"].user

        if user.is_authenticated:
            user_data = dict()
            user_data["is_known"] = user.known_headwords.filter(
                pk=obj.target_code
            ).exists()
            user_data["is_studied"] = user.studied_headwords.filter(
                pk=obj.target_code
            ).exists()
            return user_data
        else:
            return None


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
    senses = serializers.SerializerMethodField()

    class Meta(BaseKoreanHeadwordSerializer.Meta):
        fields = BaseKoreanHeadwordSerializer.Meta.fields + ["word_type", "senses"]

    def get_senses(self, obj):
        first_five = obj.senses.all().order_by("order")[:5]
        sense_serializer = SimplifiedSenseSerializer(first_five, many=True)
        return sense_serializer.data


# Serializer for Korean words as they appear in detailed view screens.
class KoreanHeadwordDetailedSerializer(BaseKoreanHeadwordSerializer):
    senses = serializers.SerializerMethodField()
    user_examples = serializers.SerializerMethodField()

    class Meta(BaseKoreanHeadwordSerializer.Meta):
        fields = BaseKoreanHeadwordSerializer.Meta.fields + [
            "word_type",
            "history_info",
            "senses",
            "user_examples",
        ]

    def get_senses(self, obj):
        all_senses = obj.senses.order_by("order")
        sense_serializer = DetailedSenseSerializer(all_senses, many=True)
        return sense_serializer.data

    def get_user_examples(self, obj):
        if not self.context["request"].user.is_authenticated:
            return None

        serialized_items = {
            "user_example_sentences": UserExampleSentenceSerializer(
                obj.user_sentences.all(), many=True
            ).data,
            "user_video_examples": UserVideoExampleSerializer(
                obj.user_videos.all(), many=True
            ).data,
            "user_image_examples": UserImageSerializer(
                obj.user_images.all(), many=True
            ).data,
            "derived_example_lemmas": DerivedExampleLemmaSearchResultSerializer(
                obj.derived_example_lemmas.all(), many=True
            ).data,
        }

        return serialized_items


# Serializer for senses as they are listed under Korean word search results.
class SimplifiedSenseSerializer(serializers.ModelSerializer):
    region_info = serializers.SerializerMethodField()

    class Meta:
        model = Sense
        fields = [
            "target_code",
            "definition",
            "type",
            "order",
            "category",
            "pos",
            "region_info",
        ]
        read_only_fields = ["__all__"]

    def get_region_info(self, obj):
        return obj.additional_info.get("region_info", None)


# Serializer for senses as they are listed under Korean word detail views.
class DetailedSenseSerializer(serializers.ModelSerializer):

    additional_info = serializers.SerializerMethodField()

    class Meta:
        model = Sense
        fields = [
            "target_code",
            "definition",
            "type",
            "order",
            "category",
            "pos",
            "additional_info",
        ]
        read_only_fields = ["__all__"]

    # Additional info originally had example info inside. It was moved out
    # later but here I add it back into the additional_info field to keep
    # the processing of additional_info (ie in the frontend) all the same
    def get_additional_info(self, obj):
        examples = obj.examples
        example_serializer = SenseExampleSerializer(examples, many=True)
        example_info = example_serializer.data

        new_additional_info = obj.additional_info
        new_additional_info["example_info"] = example_info
        return new_additional_info


class SenseExampleSerializer(serializers.ModelSerializer):

    class Meta:
        model = SenseExample
        fields = ["example", "source", "translation", "origin", "region"]
        read_only_fields = ["__all__"]


# Serializer for Korean words as they appear under Hanja popup views.
class KoreanHeadwordInHanjaCharacterPopupViewSerializer(BaseKoreanHeadwordSerializer):
    pass
    # can add more fields later (?)


# Serializer for Korean word as they appear in Hanja popup example section.
class KoreanHeadwordHanjaExampleSenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sense
        fields = ["target_code", "definition"]
        read_only_fields = ["__all__"]


# Serializer for Korean word as they appear in Hanja example section in Hanja detail page.
class KoreanHeadwordInHanjaExamplesViewSerializer(BaseKoreanHeadwordSerializer):
    first_sense = serializers.SerializerMethodField()

    class Meta(BaseKoreanHeadwordSerializer.Meta):
        fields = BaseKoreanHeadwordSerializer.Meta.fields + ["first_sense"]

    def get_first_sense(self, obj):
        first = obj.senses.all().order_by("order")[0]
        sense_serializer = KoreanHeadwordHanjaExampleSenseSerializer(first)
        return sense_serializer.data
