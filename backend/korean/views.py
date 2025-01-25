from rest_framework.generics import RetrieveAPIView

from korean.validators import KoreanSearchParamValidator
from korean.get_queryset import (
    get_korean_search_queryset_with_search_params,
    get_ordered_korean_search_results,
)
from shared.api_utils import RedirectingListAPIView, QueryParamValidationMixin
from korean.models import KoreanHeadword
from korean.serializers import (
    KoreanHeadwordDetailedSerializer,
    KoreanHeadwordSearchResultSerializer,
)
from user_examples.models import (
    DerivedExampleLemma,
    UserImage,
    UserExampleSentence,
    UserVideoExample,
)
from django.db.models import Prefetch


class KoreanHeadwordSearchResultsView(
    QueryParamValidationMixin, RedirectingListAPIView
):
    """
    API view to return a list of Korean words from a search term.

    Query Parameters:
      search_term (string): The search term.
      search_type (string): The search type. Can be any of 'word_exact', 'word_regex', 'definition_exact'.
    """

    validation_class = KoreanSearchParamValidator
    serializer_class = KoreanHeadwordSearchResultSerializer

    def get_queryset(self):
        queryset = get_korean_search_queryset_with_search_params(
            self.request.validated_query_params
        )
        return get_ordered_korean_search_results(queryset)


class KoreanHeadwordDetailedView(RetrieveAPIView):
    """API view to view details for a Korean word from its pk."""

    serializer_class = KoreanHeadwordDetailedSerializer

    def get_queryset(self):
        base_queryset = KoreanHeadword.objects.prefetch_related(
            "senses", "senses__examples"
        )

        user = self.request.user

        if not user.is_authenticated:
            return base_queryset

        word_ref = self.kwargs["pk"]

        images = UserImage.objects.filter(user_ref=user, word_ref=word_ref)
        sentences = UserExampleSentence.objects.filter(user_ref=user, word_ref=word_ref)
        videos = UserVideoExample.objects.filter(user_ref=user, word_ref=word_ref)
        lemmas = (
            DerivedExampleLemma.objects.filter(source_text__user_ref=user)
            .filter(word_ref=word_ref)
            .select_related("source_text")
        )

        return base_queryset.prefetch_related(
            Prefetch("user_images", queryset=images),
            Prefetch("user_sentences", queryset=sentences),
            Prefetch("user_videos", queryset=videos),
            Prefetch("derived_example_lemmas", queryset=lemmas),
        )
