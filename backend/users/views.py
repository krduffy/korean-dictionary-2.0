from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.generics import GenericAPIView
from rest_framework import serializers

from words.models import HanjaCharacter, KoreanWord
from users.serializers import FullUserSerializer


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
        choices=[("true", "true"), ("false", "false")]
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

        korean_or_hanja = serializer.validated_data["korean_or_hanja"]
        known_or_studied = serializer.validated_data["known_or_studied"]
        set_true_or_false = serializer.validated_data["set_true_or_false"] == "true"

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
