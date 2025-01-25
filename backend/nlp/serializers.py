from rest_framework import serializers
from backend.settings import BASE_URL
from nlp.models import DerivedExampleLemma


class DerivedExampleLemmaInKoreanDetailSerializer(serializers.ModelSerializer):

    source_text_pk = serializers.IntegerField(source="source_text.pk")
    source_text_preview = serializers.SerializerMethodField()
    source = serializers.CharField(source="source_text.source")
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DerivedExampleLemma
        fields = [
            "source_text_preview",
            "lemma",
            "source",
            "source_text_pk",
            "eojeol_number_in_source_text",
            "image_url",
        ]
        read_only_fields = ["__all__"]

    def get_source_text_preview(self, obj):
        """Gets a preview of the source text, showing the portion
        of the text in which this lemma appears"""
        full_text = obj.source_text.text

        tokenized = full_text.split()

        central_eojeol_num = obj.eojeol_number_in_source_text
        tokens_around_central_shown = 10

        starting_index = central_eojeol_num - tokens_around_central_shown
        ending_index = central_eojeol_num + tokens_around_central_shown + 1

        context_before = "..." if starting_index > 0 else ""
        context_before += " ".join(tokenized[starting_index:central_eojeol_num])
        if len(context_before) > 0:
            context_before += " "

        context_after = " ".join(tokenized[central_eojeol_num + 1 : ending_index])
        context_after += "..." if ending_index < len(tokenized) else ""

        ending_target_span = "[/TGT]" if len(context_after) == 0 else "[/TGT] "

        return (
            context_before
            + "[TGT]"
            + tokenized[central_eojeol_num]
            + ending_target_span
            + context_after
        )

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
