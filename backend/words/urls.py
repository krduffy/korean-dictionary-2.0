from django.urls import path
from words.views import KoreanWordSearchResultsView, HanjaCharacterSearchResultsView, KoreanWordDetailedView, HanjaCharacterDetailedView

urlpatterns = [
  path('search/korean/', KoreanWordSearchResultsView.as_view(), name='search_korean'),
  path('search/hanja/', HanjaCharacterSearchResultsView.as_view(), name='search_hanja'),

  path('detail/korean/<pk>', KoreanWordDetailedView.as_view(), name='detail_korean'),
  path('detail/hanja/<pk>', HanjaCharacterDetailedView.as_view(), name='detail_hanja'),
]

