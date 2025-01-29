from rest_framework.permissions import IsAuthenticated
from shared.api_utils import (
    RedirectingListAPIView,
    QueryParamValidationMixin,
    get_users_object_or_404,
)
from rest_framework import serializers, generics
from user_examples.models import DerivedExampleLemma, DerivedExampleText
from user_examples.serializers import (
    DerivedExampleLemmaSearchResultSerializer,
    DerivedExampleLemmaInSourceTextPageSerializer,
    DerivedExampleTextSerializer,
)
from django.db.models import Q
from korean.headword_serializers import KoreanHeadwordSearchResultSerializer
from korean.models import KoreanHeadword


class ValidateGetDerivedExampleLemmasViewQueryParameters(serializers.Serializer):
    lemma = serializers.CharField(required=False)
    headword_pk = serializers.IntegerField(required=False)


class GetDerivedExampleLemmasSearchView(
    QueryParamValidationMixin, RedirectingListAPIView
):
    """
    Returns a list of the user's derived example lemmas.

    Query paramaters:
      `page` (int): The page number to view.
      `lemma` (str): A lemma whose headwords should be returned.
      `headword_pk` (int): A pk whose word's derived examples should be returned.
    """

    validation_class = ValidateGetDerivedExampleLemmasViewQueryParameters
    serializer_class = DerivedExampleLemmaSearchResultSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        lemma = self.request.validated_query_params.get("lemma")
        headword_pk = self.request.validated_query_params.get("headword_pk")
        source_text_pk = self.request.validated_query_params.get("source_text_pk")

        derived_example_lemmas = DerivedExampleLemma.objects.select_related(
            "source_text"
        ).filter(source_text__user_ref=user.pk)

        if headword_pk:
            derived_example_lemmas = derived_example_lemmas.filter(
                headword_ref__pk=headword_pk
            )

        if source_text_pk:
            derived_example_lemmas = derived_example_lemmas.filter(
                source_text__pk=source_text_pk
            )

        if lemma:
            derived_example_lemmas = derived_example_lemmas.filter(
                headword_ref__word__exact=lemma
            )

        return derived_example_lemmas.order_by("pk")


class ValidateGetDerivedExampleLemmasViewQueryParameters(serializers.Serializer):
    only_unknown = serializers.BooleanField(required=False, default=False)


class GetDerivedExampleLemmasFromTextView(
    QueryParamValidationMixin, RedirectingListAPIView
):
    """
    Returns a list of the user's derived example lemmas from a specific text.

    Kwargs:
      `pk` (int): The pk of the source text from which lemmas should be returned.

    Query parameters:
      `only_unknown` (bool): Whether only words not in the known list are returned.
    """

    validation_class = ValidateGetDerivedExampleLemmasViewQueryParameters
    serializer_class = DerivedExampleLemmaInSourceTextPageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        source_text_pk = self.kwargs["pk"]

        source_text = get_users_object_or_404(
            DerivedExampleText, user, pk=source_text_pk
        )

        only_unknown = self.request.validated_query_params.get("only_unknown")

        queryset = source_text.derived_example_lemmas.select_related(
            "headword_ref"
        ).prefetch_related("headword_ref__senses")

        if not only_unknown:
            return queryset.all()

        user_known_headword_pks = user.known_headwords.values_list("pk", flat=True)

        queryset = (
            queryset.annotate(
                is_known_by_user=Q(headword_ref__pk__in=user_known_headword_pks)
            )
            .filter(is_known_by_user=False)
            .order_by("eojeol_number_in_source_text")
        )

        return queryset


class GetDerivedExampleLemmasFromTextAtEojeolNumView(RedirectingListAPIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = KoreanHeadwordSearchResultSerializer

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        source_text_pk = self.kwargs["source_text_pk"]

        source_text = get_users_object_or_404(
            DerivedExampleText, user, pk=source_text_pk
        )

        eojeol_num = self.kwargs["eojeol_num"]

        headword_pks = source_text.derived_example_lemmas.filter(
            eojeol_number_in_source_text=eojeol_num
        ).values_list("headword_ref__target_code")

        headwords = KoreanHeadword.objects.filter(
            target_code__in=headword_pks
        ).order_by("target_code")

        return headwords


class GetDerivedExampleTextView(generics.RetrieveAPIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = DerivedExampleTextSerializer

    def get_object(self):
        user = self.request.user
        source_text_pk = self.kwargs["pk"]

        source_text = get_users_object_or_404(
            DerivedExampleText, user, pk=source_text_pk
        )

        return source_text
