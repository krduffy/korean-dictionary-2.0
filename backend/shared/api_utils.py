from django.http import HttpResponseRedirect

from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.http import Http404

import math


def get_users_object_or_404(model, user, **kwargs):
    """Base `get_object_or_404` function, but returns 404 even if the object
    exists if the object's `user_ref` is not `user`"""
    model_object = get_object_or_404(model, **kwargs)
    if model_object.user_ref != user:
        Http404("Object not found.")
    return model_object


def get_bad_request(detail_msg):
    return Response({"detail": detail_msg}, status=status.HTTP_400_BAD_REQUEST)


class QueryParamValidationMixin:
    """Validates query parameters using `self.validation_class`.
    If the query parameters are valid, they can be accessed in get_queryset
    from `self.request.validated_query_params`."""

    def get(self, request, *args, **kwargs):
        query_params = self.request.query_params

        serializer = self.validation_class(data=query_params)
        serializer.is_valid(raise_exception=True)

        self.request.validated_query_params = serializer.validated_data

        return super().get(request, *args, **kwargs)


class RedirectingPagination(PageNumberPagination):
    page_size = 5

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
                new_url = new_url.replace(
                    f"page={requested_page}", f"page={new_page_num}"
                )

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
