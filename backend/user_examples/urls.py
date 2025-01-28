from django.urls import path
from user_examples.post_views import (
    AddExampleSentenceView,
    AddImageExampleView,
    AddVideoExampleView,
)
from user_examples.get_views import (
    GetDerivedExampleLemmasSearchView,
    GetDerivedExampleLemmasFromTextView,
    GetDerivedExampleLemmasFromTextAtEojeolNumView,
    GetDerivedExampleTextView,
)

urlpatterns = [
    # Post requests; derive examples post view in nlp app because the logic is more
    # involved
    path("add/video", AddVideoExampleView.as_view(), name="add_video"),
    path("add/sentence", AddExampleSentenceView.as_view(), name="add_sentence"),
    path("add/image", AddImageExampleView.as_view(), name="add_image"),
    # Get requests
    path(
        "get/derived_example_lemmas/search",
        GetDerivedExampleLemmasSearchView.as_view(),
        name="get_derived_example_lemmas_search",
    ),
    path(
        "get/derived_example_lemmas/from_text/<pk>",
        GetDerivedExampleLemmasFromTextView.as_view(),
        name="get_derived_example_lemmas_from_text",
    ),
    path(
        "get/derived_example_lemmas/from_text/<source_text_pk>/<eojeol_num>",
        GetDerivedExampleLemmasFromTextAtEojeolNumView.as_view(),
        name="get_derived_example_lemmas_from_text_at_eojeol_num",
    ),
    path(
        "get/derived_example_text/<pk>",
        GetDerivedExampleTextView.as_view(),
        name="get_derived_example_text",
    ),
]
