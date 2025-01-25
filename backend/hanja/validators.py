from rest_framework import serializers


class RelopField(serializers.CharField):
    """
    Serializer field for handling relop-prefixed strings.
    Parses strings like 'gte10' into ('gte', '10').
    """

    allowed_relops = ["eq", "gte", "gt", "lte", "lt", "not"]

    def to_internal_value(self, data):
        for relop in self.allowed_relops:
            if data.startswith(relop):
                value = data[len(relop) :]
                if not value.isdigit():
                    raise serializers.ValidationError(
                        f"Invalid value after relop '{relop}'. Must be an integer."
                    )
                return {"relop": relop, "value": int(value)}
        raise serializers.ValidationError(
            f"Invalid relop prefix. Allowed: {', '.join(self.allowed_relops)}"
        )


class HanjaSearchParamValidator(serializers.Serializer):
    page = serializers.IntegerField(required=False, min_value=1)
    search_term = serializers.CharField(max_length=50, required=True)
    decomposition = serializers.CharField(max_length=5, required=False)
    radical = serializers.CharField(max_length=1, required=False)
    strokes = RelopField(required=False)
    grade_level = serializers.ChoiceField(
        choices=["중학교", "고등학교", "미배정"], required=False
    )
    result_ranking = RelopField(required=False)
