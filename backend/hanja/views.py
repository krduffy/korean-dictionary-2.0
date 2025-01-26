from rest_framework.generics import RetrieveAPIView

from hanja.get_queryset import (
    get_hanja_search_queryset_with_search_params,
    get_ordered_hanja_example_queryset,
)
from korean.models import KoreanHeadword
from korean.headword_serializers import (
    KoreanHeadwordAsExampleSerializer,
)
from hanja.validators import HanjaSearchParamValidator
from shared.api_utils import RedirectingListAPIView, QueryParamValidationMixin
from hanja.models import HanjaCharacter
from hanja.serializers import (
    HanjaCharacterDetailedSerializer,
    HanjaCharacterSearchResultSerializer,
    HanjaCharacterPopupViewSerializer,
)


class HanjaCharacterSearchResultsView(
    QueryParamValidationMixin, RedirectingListAPIView
):
    """
    API view to return a list of Hanja characters from a search term.

    Query Parameters:
      search_term (string): The search term.
      search_type (string): The search type. Can be any of 'word_exact', 'word_regex', 'definition_exact'.

    """

    validation_class = HanjaSearchParamValidator
    serializer_class = HanjaCharacterSearchResultSerializer

    def get_queryset(self):
        query_params = self.request.validated_query_params
        return get_hanja_search_queryset_with_search_params(query_params)


class HanjaCharacterDetailedView(RetrieveAPIView):
    queryset = HanjaCharacter.objects.all()
    serializer_class = HanjaCharacterDetailedSerializer


class HanjaCharacterPopupView(RetrieveAPIView):
    queryset = HanjaCharacter.objects.all()
    serializer_class = HanjaCharacterPopupViewSerializer


class HanjaCharacterExamplesView(RedirectingListAPIView):
    serializer_class = KoreanHeadwordAsExampleSerializer

    def get_queryset(self):
        hanja_char = self.kwargs["pk"]
        initial_queryset = KoreanHeadword.objects.filter(origin__contains=hanja_char)
        return get_ordered_hanja_example_queryset(initial_queryset, self.request.user)
