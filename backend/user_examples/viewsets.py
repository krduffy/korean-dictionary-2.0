from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers, viewsets, mixins
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

from shared.api_utils import RedirectingListAPIView
from user_examples.serializers import DerivedExampleTextSerializer
from user_examples.models import (
    UserVideoExample,
    UserExampleSentence,
    UserImage,
    DerivedExampleText,
    DerivedExampleLemma,
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


class UserExampleViewset(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)

    def get_serializer(self, *args, **kwargs):
        if self.action == "create":
            data = kwargs.get("data", {}).copy()
            data["headword_ref"] = self.kwargs["target_code"]
            kwargs["data"] = data

        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        user = self.request.user
        queryset = queryset.filter(user_ref=user)

        target_code = self.kwargs["target_code"]
        queryset = queryset.filter(headword_ref__target_code=target_code)

        return queryset


class VideoExampleViewset(UserExampleViewset):
    queryset = UserVideoExample.objects
    serializer_class = AddVideoExampleViewValidator
    permission_classes = (IsAuthenticated,)


class ExampleSentenceViewset(UserExampleViewset):
    queryset = UserExampleSentence.objects
    serializer_class = AddExampleSentenceViewValidator
    permission_classes = (IsAuthenticated,)


class ImageExampleViewset(UserExampleViewset):
    queryset = UserImage.objects
    serializer_class = AddImageExampleViewValidator
    permission_classes = (IsAuthenticated,)


# create intentionally not here
class DerivedExampleTextViewset(
    RedirectingListAPIView,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.SearchFilter]
    serializer_class = DerivedExampleTextSerializer
    search_fields = ["source"]

    def get_queryset(self):
        queryset = DerivedExampleText.objects

        user = self.request.user
        queryset = queryset.filter(user_ref=user)

        queryset = queryset.order_by("id")

        return queryset
