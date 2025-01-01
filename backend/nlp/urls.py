from django.urls import path
from nlp.analyze_view import FindLemmaInStringView

urlpatterns = [
    path("find_lemma/", FindLemmaInStringView.as_view(), name="find_lemma"),
]
