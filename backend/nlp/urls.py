from django.urls import path
from nlp.find_lemma_view import FindLemmaInStringView
from nlp.derive_examples_view import DeriveExamplesFromTextView

urlpatterns = [
    path(
        "analyze/get_lemma", FindLemmaInStringView.as_view(), name="analyze_get_lemma"
    ),
    path(
        "analyze/derive_lemma_examples",
        DeriveExamplesFromTextView.as_view(),
        name="analyze_derive_lemma_examples",
    ),
]
