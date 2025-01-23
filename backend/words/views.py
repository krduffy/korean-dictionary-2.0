from django.shortcuts import render

from rest_framework.generics import RetrieveAPIView

from words.validators import get_hanja_search_param_error, get_korean_search_param_error
from shared.api_utils import RedirectingListAPIView
from words.models import HanjaCharacter, KoreanWord
from words.serializers import (
    HanjaCharacterDetailedSerializer,
    KoreanWordDetailedSerializer,
    KoreanWordSearchResultSerializer,
    HanjaCharacterSearchResultSerializer,
    HanjaCharacterPopupViewSerializer,
    KoreanWordInHanjaExamplesViewSerializer,
)
from users.models import User, UserImage, UserExampleSentence, UserVideoExample
from nlp.models import DerivedExampleLemma, DerivedExampleText
from silk.profiling.profiler import silk_profile
from words.queryset_operations import (
    get_korean_search_queryset_with_search_params,
    filter_hanja_search_with_search_params,
    get_ordered_korean_search_results,
    get_ordered_hanja_search_results,
    get_ordered_hanja_example_queryset,
)
from django.db.models import Prefetch


class KoreanWordSearchResultsView(RedirectingListAPIView):
    """
    API view to return a list of Korean words from a search term.

    Query Parameters:
      search_term (string): The search term.
      search_type (string): The search type. Can be any of 'word_exact', 'word_regex', 'definition_exact'.
    """

    serializer_class = KoreanWordSearchResultSerializer

    @silk_profile(name="GET_KOREAN_SEARCH_RESULTS")
    def get(self, request, *args, **kwargs):

        query_params = self.request.query_params
        user = self.request.user

        validation_error = get_korean_search_param_error(query_params, user)

        if validation_error:
            return validation_error

        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = get_korean_search_queryset_with_search_params(
            self.request.query_params
        )
        return get_ordered_korean_search_results(queryset)


class HanjaCharacterSearchResultsView(RedirectingListAPIView):
    serializer_class = HanjaCharacterSearchResultSerializer

    """
    API view to return a list of Hanja characters from a search term.
  
    Query Parameters:
      search_term (string): The search term.
      search_type (string): The search type. Can be any of 'word_exact', 'word_regex', 'definition_exact'.
      
  """
    serializer_class = HanjaCharacterSearchResultSerializer

    def get(self, request, *args, **kwargs):

        query_params = self.request.query_params
        validation_error = get_hanja_search_param_error(query_params)

        if validation_error:
            return validation_error

        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        query_params = self.request.query_params

        queryset = HanjaCharacter.objects.prefetch_related("meaning_readings")

        queryset = filter_hanja_search_with_search_params(queryset, query_params)

        search_term = self.request.query_params["search_term"]
        return get_ordered_hanja_search_results(queryset, search_term)


class KoreanWordDetailedView(RetrieveAPIView):
    """API view to view details for a Korean word from its pk."""

    serializer_class = KoreanWordDetailedSerializer

    def get_queryset(self):
        base_queryset = KoreanWord.objects.prefetch_related(
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


class HanjaCharacterDetailedView(RetrieveAPIView):
    queryset = HanjaCharacter.objects.all()
    serializer_class = HanjaCharacterDetailedSerializer


class HanjaCharacterPopupView(RetrieveAPIView):
    queryset = HanjaCharacter.objects.all()
    serializer_class = HanjaCharacterPopupViewSerializer


class HanjaCharacterExamplesView(RedirectingListAPIView):
    serializer_class = KoreanWordInHanjaExamplesViewSerializer

    def get_queryset(self):
        hanja_char = self.kwargs["pk"]
        initial_queryset = KoreanWord.objects.all().filter(origin__contains=hanja_char)
        return get_ordered_hanja_example_queryset(initial_queryset, self.request.user)
