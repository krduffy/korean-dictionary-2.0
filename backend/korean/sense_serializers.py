from rest_framework import serializers

from korean.models import Sense, SenseExample


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
