from django.urls import path
from words.views import KoreanWordSearchResultsView

urlpatterns = [
  path('search/korean', KoreanWordSearchResultsView.as_view(), name='search_korean'),
]

