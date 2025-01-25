from django.urls import path
from user_examples.views import (
    AddExampleSentenceView,
    AddImageExampleView,
    AddVideoExampleView,
)

urlpatterns = [
    # Post requests
    path("add/video", AddVideoExampleView.as_view(), name="add_video"),
    path("add/sentence", AddExampleSentenceView.as_view(), name="add_sentence"),
    path("add/image", AddImageExampleView.as_view(), name="add_image"),
]
