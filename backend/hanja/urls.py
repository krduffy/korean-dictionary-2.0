from django.urls import path
from hanja.views import (
    HanjaCharacterSearchResultsView,
    HanjaCharacterDetailedView,
    HanjaCharacterPopupView,
    HanjaCharacterExamplesView,
)

urlpatterns = [
    path("search", HanjaCharacterSearchResultsView.as_view(), name="hanja_search"),
    path("detail/<pk>", HanjaCharacterDetailedView.as_view(), name="hanja_detail"),
    path("popup/<pk>", HanjaCharacterPopupView.as_view(), name="hanja_popup"),
    path(
        "examples/<pk>",
        HanjaCharacterExamplesView.as_view(),
        name="hanja_examples",
    ),
]
