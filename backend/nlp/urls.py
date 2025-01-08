from django.urls import path
from nlp.find_lemma_view import FindLemmaInStringView
from nlp.derive_examples_view import DeriveExamplesFromTextView

urlpatterns = [
    path("find_lemma/", FindLemmaInStringView.as_view(), name="find_lemma"),
    path(
        "derive_examples_from_text/",
        DeriveExamplesFromTextView.as_view(),
        name="derive_examples_from_text",
    ),
]
