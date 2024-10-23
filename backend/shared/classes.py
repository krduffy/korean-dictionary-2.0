from django.http import HttpResponseRedirect

from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView

import math

class RedirectingPagination(PageNumberPagination):
  page_size = 10

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.redirect_url = None

  def paginate_queryset(self, queryset, request, view=None):
    try:
      return super().paginate_queryset(queryset, request)
    except Exception as e:
      requested_page = int(request.query_params.get(self.page_query_param, 1))
      min_page = 1
      max_page = math.ceil(queryset.count() / self.page_size)

      if requested_page < min_page or requested_page > max_page:

        new_page_num = min_page if requested_page < min_page else max_page

        new_url = request.build_absolute_uri()
        new_url = new_url.replace(f'page={requested_page}', f'page={new_page_num}')
      
        self.redirect_url = new_url
        return []
      else:
        raise

class RedirectingListAPIView(ListAPIView):
  pagination_class = RedirectingPagination

  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())
    page = self.paginate_queryset(queryset)

    if page is not None:

      if self.paginator.redirect_url:
        return HttpResponseRedirect(self.paginator.redirect_url)
      
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)