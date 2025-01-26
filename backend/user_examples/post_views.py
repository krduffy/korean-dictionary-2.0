from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework import serializers

from user_examples.models import UserVideoExample, UserExampleSentence, UserImage


class BaseExampleValidator(serializers.ModelSerializer):

    class Meta:
        fields = "__all__"
        read_only_fields = ["id"]

    def to_internal_value(self, data):
        user_pk = self.context["request"].user.pk
        copied_data = data.copy()
        copied_data["user_ref"] = user_pk
        return super().to_internal_value(copied_data)


class AddVideoExampleViewValidator(BaseExampleValidator):
    class Meta(BaseExampleValidator.Meta):
        model = UserVideoExample


class AddExampleSentenceViewValidator(BaseExampleValidator):
    class Meta(BaseExampleValidator.Meta):
        model = UserExampleSentence


class AddImageExampleViewValidator(BaseExampleValidator):
    class Meta(BaseExampleValidator.Meta):
        model = UserImage

    def validate(self, data):
        if not data.get("remote_image_url") and not data.get("nonremote_image_url"):
            raise serializers.ValidationError(
                "A remote or nonremote image url must be provided."
            )
        if data.get("remote_image_url") and data.get("nonremote_image_url"):
            raise serializers.ValidationError(
                "A remote and nonremote image url cannot both be provided."
            )
        return data


class AddVideoExampleView(CreateAPIView):
    queryset = UserVideoExample.objects
    serializer_class = AddVideoExampleViewValidator
    permission_classes = (IsAuthenticated,)


class AddExampleSentenceView(CreateAPIView):
    queryset = UserExampleSentence.objects
    serializer_class = AddExampleSentenceViewValidator
    permission_classes = (IsAuthenticated,)


class AddImageExampleView(CreateAPIView):
    queryset = UserImage
    serializer_class = AddImageExampleViewValidator
    permission_classes = (IsAuthenticated,)
