from rest_framework import serializers
from korean.headword_serializers import KoreanHeadwordAsExampleSerializer
from backend.settings import BASE_URL
from user_examples.models import (
    UserExampleSentence,
    UserImage,
    UserVideoExample,
    DerivedExampleLemma,
    DerivedExampleText,
)


class UserImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserImage
        fields = ["id", "image_accompanying_text", "image_url", "source"]


class UserExampleSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExampleSentence
        fields = ["id", "sentence", "source"]


class UserVideoExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVideoExample
        fields = ["id", "video_id", "video_text", "start", "end", "source"]


class BaseDerivedExampleLemmaSerializer(serializers.ModelSerializer):
    source_text_preview = serializers.CharField()

    class Meta:
        model = DerivedExampleLemma
        fields = [
            "lemma",
            "eojeol_number_in_source_text",
        ]
        read_only_fields = ["__all__"]


class DerivedExampleLemmaSearchResultSerializer(BaseDerivedExampleLemmaSerializer):

    source_text_pk = serializers.IntegerField(source="source_text.pk")
    source = serializers.CharField(source="source_text.source")

    class Meta:
        model = DerivedExampleLemma
        fields = BaseDerivedExampleLemmaSerializer.Meta.fields + [
            "source_text_preview",
            "source",
            "source_text_pk",
            "image_url",
        ]


class DerivedExampleLemmaInSourceTextPageSerializer(BaseDerivedExampleLemmaSerializer):

    headword_ref = KoreanHeadwordAsExampleSerializer()

    class Meta:
        model = DerivedExampleLemma
        fields = BaseDerivedExampleLemmaSerializer.Meta.fields + ["headword_ref"]


class DerivedExampleTextSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField()

    class Meta:
        model = DerivedExampleText
        fields = ["id", "text", "source", "image_url"]
        read_only_fields = ["__all__"]
