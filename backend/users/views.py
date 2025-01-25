from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.generics import GenericAPIView, CreateAPIView
from rest_framework import serializers

from words.models import HanjaCharacter, KoreanWord
from users.serializers import FullUserSerializer
from users.models import UserVideoExample, UserExampleSentence, UserImage


class RetrieveUserView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = FullUserSerializer(request.user)
        return Response(serializer.data, status=HTTP_200_OK)


class UpdateKnownOrStudiedViewValidator(serializers.Serializer):
    korean_or_hanja = serializers.ChoiceField(
        choices=[("korean", "korean"), ("hanja", "hanja")]
    )
    known_or_studied = serializers.ChoiceField(
        choices=[("known", "known"), ("studied", "studied")]
    )
    set_true_or_false = serializers.ChoiceField(
        choices=[(True, "true"), (False, "false")]
    )


class UpdateKnownOrStudiedView(GenericAPIView):
    """
    Updates a word or Hanja character to be known or studied or not known or not studied.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateKnownOrStudiedViewValidator

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        korean_or_hanja: str = serializer.validated_data["korean_or_hanja"]
        known_or_studied: str = serializer.validated_data["known_or_studied"]
        set_true_or_false: bool = serializer.validated_data["set_true_or_false"]

        pk = self.kwargs["pk"]
        user = request.user

        # Select the appropriate model and user attribute based on `korean_or_hanja`
        Model, user_attr = (
            (KoreanWord, "known_words")
            if korean_or_hanja == "korean"
            else (HanjaCharacter, "known_hanja")
        )
        if known_or_studied == "studied":
            user_attr = (
                "studied_words" if korean_or_hanja == "korean" else "studied_hanja"
            )

        # Retrieve the word or character object
        instance = get_object_or_404(Model, pk=pk)

        # Update the user's set based on `set_true_or_false`
        user_set = getattr(user, user_attr)
        if set_true_or_false:
            user_set.add(instance)
            action = "set to known" if known_or_studied == "known" else "set to studied"
        else:
            user_set.remove(instance)
            action = (
                "set to unknown"
                if known_or_studied == "known"
                else "set to not studied"
            )

        user.save()
        return Response(
            data={
                "detail": f"{'Word' if korean_or_hanja == 'korean' else 'Character'} is {action}."
            },
            status=HTTP_200_OK,
        )


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
