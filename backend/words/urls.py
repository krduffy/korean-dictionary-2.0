from django.urls import path
from words.views import KoreanWordSearchResultsView, HanjaCharacterSearchResultsView, KoreanWordDetailedView, HanjaCharacterDetailedView, HanjaCharacterPopupView, HanjaCharacterExamplesView

urlpatterns = [
  path('korean/search/', KoreanWordSearchResultsView.as_view(), name='korean_search'),
  path('korean/detail/<pk>', KoreanWordDetailedView.as_view(), name='korean_detail'),
  
  path('hanja/search/', HanjaCharacterSearchResultsView.as_view(), name='hanja_search'),
  path('hanja/detail/<pk>', HanjaCharacterDetailedView.as_view(), name='hanja_detail'),
  path('hanja/popup/<pk>', HanjaCharacterPopupView.as_view(), name='hanja_popup'),
  path('hanja/examples/<pk>', HanjaCharacterExamplesView.as_view(), name='hanja_examples')
]

