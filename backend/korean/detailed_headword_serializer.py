from korean.headword_serializers import BaseKoreanHeadwordSerializer
from korean.sense_serializers import DetailedSenseSerializer
from user_examples.serializers import (
    DerivedExampleLemmaSearchResultSerializer,
    UserExampleSentenceSerializer,
    UserImageSerializer,
    UserVideoExampleSerializer,
)
from rest_framework import serializers

# This has its own file to prevent circular import
# with user_examples.serializers file


class KoreanHeadwordDetailedSerializer(BaseKoreanHeadwordSerializer):
    senses = DetailedSenseSerializer(many=True)
    user_examples = serializers.SerializerMethodField()

    class Meta(BaseKoreanHeadwordSerializer.Meta):
        fields = BaseKoreanHeadwordSerializer.Meta.fields + [
            "word_type",
            "history_info",
            "senses",
            "user_examples",
        ]

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
