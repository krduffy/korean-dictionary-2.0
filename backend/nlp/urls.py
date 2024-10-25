from django.urls import path
from nlp.analyze_view import KoreanWordAnalyze

urlpatterns = [
  path('find_lemma/', KoreanWordAnalyze.as_view(), name='find_lemma'),
]

