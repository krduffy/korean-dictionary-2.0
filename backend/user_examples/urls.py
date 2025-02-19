from django.urls import path, include
from user_examples.viewsets import (
    VideoExampleViewset,
    ImageExampleViewset,
    ExampleSentenceViewset,
)
from user_examples.get_views import (
    GetDerivedExampleLemmasSearchView,
    GetDerivedExampleLemmasFromTextView,
    GetDerivedExampleLemmasFromTextAtEojeolNumView,
    GetDerivedExampleTextView,
)
from rest_framework.routers import DefaultRouter

user_examples_router = DefaultRouter(trailing_slash=False)
# viewsets
user_examples_router.register("video", VideoExampleViewset, basename="video")
user_examples_router.register("sentence", ExampleSentenceViewset, basename="sentence")
user_examples_router.register("image", ImageExampleViewset, basename="image")

urlpatterns = [
    path("<target_code>/", include(user_examples_router.urls)),
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
