from rest_framework import serializers
from korean.headword_serializers import KoreanHeadwordAsExampleSerializer
from backend.settings import BASE_URL
from user_examples.models import (
    UserExampleSentence,
    UserImage,
    UserVideoExample,
    DerivedExampleLemma,
)


class UserImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = UserImage
        fields = ["id", "image_accompanying_text", "image_url", "source"]

    def get_image_url(self, obj):
        # copied from code serializer for lemma deriving text
        # for user image, both fields cannot be None
        """Gets a single image url from the model object. If there is an uploaded
        image (`image` column; has server's origin) then it returns only that.
        If there is a remote image url then it returns that. If neither exists,
        it returns None."""

        nonremote_image_url = obj.nonremote_image_url
        if nonremote_image_url:
            # Is ImageField
            return BASE_URL + nonremote_image_url.url

        remote_image_url = obj.remote_image_url
        if remote_image_url:
            # Is CharField
            return remote_image_url

        # keeping it like this for development; this is not caught anywhere
        raise Exception("Image has neither nonremote nor remote image url")


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
            "source_text_preview",
            "lemma",
            "eojeol_number_in_source_text",
        ]
        read_only_fields = ["__all__"]


class DerivedExampleLemmaSearchResultSerializer(BaseDerivedExampleLemmaSerializer):

    source_text_pk = serializers.IntegerField(source="source_text.pk")
    source = serializers.CharField(source="source_text.source")
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DerivedExampleLemma
        fields = BaseDerivedExampleLemmaSerializer.Meta.fields + [
            "source",
            "source_text_pk",
            "image_url",
        ]

    def get_image_url(self, obj):
        """Gets a single image url from the model object. If there is an uploaded
        image (`image` column; has server's origin) then it returns only that.
        If there is a remote image url then it returns that. If neither exists,
        it returns None."""

        nonremote_image_url = obj.source_text.nonremote_image_url
        if nonremote_image_url:
            # Is ImageField
            return BASE_URL + nonremote_image_url.url

        remote_image_url = obj.source_text.remote_image_url
        if remote_image_url:
            # Is CharField
            return remote_image_url

        return None


class DerivedExampleLemmaInSourceTextPageSerializer(BaseDerivedExampleLemmaSerializer):

    headword_ref = KoreanHeadwordAsExampleSerializer()

    class Meta:
        model = DerivedExampleLemma
        fields = BaseDerivedExampleLemmaSerializer.Meta.fields + ["headword_ref"]
