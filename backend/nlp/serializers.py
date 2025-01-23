from rest_framework import serializers
from nlp.models import DerivedExampleLemma


class DerivedExampleLemmaInKoreanDetailSerializer(serializers.ModelSerializer):

    source_text_pk = serializers.IntegerField(source="source_text")
    source_text_preview = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()

    class Meta:
        model = DerivedExampleLemma
        fields = [
            "source_text_preview",
            "lemma",
            "source",
            "source_text_pk",
            "eojeol_number_in_source_text",
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

    def get_source(self, obj):
        return obj.source_text.source
