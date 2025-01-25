from rest_framework.generics import RetrieveAPIView

from hanja.get_queryset import get_ordered_hanja_example_queryset
from korean.models import KoreanHeadword
from korean.serializers import KoreanHeadwordInHanjaExamplesViewSerializer
from hanja.validators import HanjaSearchParamValidator
from shared.api_utils import RedirectingListAPIView
from hanja.models import HanjaCharacter
from hanja.serializers import (
    HanjaCharacterDetailedSerializer,
    HanjaCharacterSearchResultSerializer,
    HanjaCharacterPopupViewSerializer,
)


class HanjaCharacterSearchResultsView(RedirectingListAPIView):
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

        return


class HanjaCharacterDetailedView(RetrieveAPIView):
    queryset = HanjaCharacter.objects.all()
    serializer_class = HanjaCharacterDetailedSerializer


class HanjaCharacterPopupView(RetrieveAPIView):
    queryset = HanjaCharacter.objects.all()
    serializer_class = HanjaCharacterPopupViewSerializer


class HanjaCharacterExamplesView(RedirectingListAPIView):
    serializer_class = KoreanHeadwordInHanjaExamplesViewSerializer

    def get_queryset(self):
        hanja_char = self.kwargs["pk"]
        initial_queryset = KoreanHeadword.objects.all().filter(
            origin__contains=hanja_char
        )
        return get_ordered_hanja_example_queryset(initial_queryset, self.request.user)
