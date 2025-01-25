from django.urls import path
from korean.views import KoreanHeadwordSearchResultsView, KoreanHeadwordDetailedView

urlpatterns = [
    path("search", KoreanHeadwordSearchResultsView.as_view(), name="korean_search"),
    path("detail/<pk>", KoreanHeadwordDetailedView.as_view(), name="korean_detail"),
]
