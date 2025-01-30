from rest_framework import serializers


class KoreanSearchParamValidator(serializers.Serializer):
    page = serializers.IntegerField(required=False, min_value=1)
    search_term = serializers.CharField(max_length=50, required=True)
    search_type = serializers.ChoiceField(
        choices=["word_exact", "word_regex", "definition_contains"],
        default="word_exact",
    )

    def validate_search_type(self, value):
        user = self.context["request"].user
        if value == "word_regex" and (not user or not user.is_staff):
            raise serializers.ValidationError(
                "Search type 'word_regex' is not allowed."
            )
        return value
