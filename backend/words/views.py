from django.forms import ValidationError
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination

from shared.functions import is_hanja
from shared.classes import RedirectingListAPIView
from words.models import KoreanWord
from words.serializers import KoreanWordSearchResultSerializer
from words.order_queryset import get_ordered_korean_search_results

import re

class KoreanWordSearchResultsView(RedirectingListAPIView):
  """
    API view to return a list of Korean words from a search term.
  
    Query Parameters:
      search_term (string): The search term.
      search_type (string): The search type. Can be any of 'word_exact', 'word_regex', 'definition_exact'.
  """
  serializer_class = KoreanWordSearchResultSerializer
  
  def get(self, request, *args, **kwargs):
    search_term = self.request.query_params.get('search_term', '')
    if not search_term:
      return Response({"detail": "A search term is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    search_type = self.request.query_params.get('search_type', 'word_exact')
    valid_search_types = ["word_exact", "word_regex", "definition_contains"]
    if search_type not in valid_search_types:
      return Response({"detail": "Search type provided is unsupported."}, status=status.HTTP_400_BAD_REQUEST)
    if search_type == 'word_regex' and not self.request.user.is_staff:
      return Response({"detail": "Search type provided is unsupported."}, status=status.HTTP_400_BAD_REQUEST)

    return self.list(request, *args, **kwargs)

  def get_queryset(self):
    search_term = self.request.query_params['search_term']
    search_type = self.request.query_params.get('search_type', 'word_exact')
    queryset = None

    if search_type == 'word_exact':
      for character in search_term:
        # If the word contains any hanja then it will instead check the origin field
        # So searching '單語' will return the word '단어'
        if is_hanja(character):
          queryset = KoreanWord.objects.filter(origin__exact = search_term)
          break
      
      queryset = KoreanWord.objects.filter(word__exact = search_term)
    elif search_type == 'word_regex':
      regized_search_term = '^' + search_term + '$'
      
      try: 
        re.compile(regized_search_term)
      except re.error:
        regized_search_term = re.escape(regized_search_term)

      for character in search_term:
        # If the word contains any hanja then it will instead check the origin field
        # So searching '.語' will return (among others) the word '단어'
        if is_hanja(character):
          queryset = KoreanWord.objects.filter(origin__iregex = regized_search_term)
          break

      queryset = queryset.filter(word__iregex = regized_search_term)
    elif search_type == 'definition_contains':
      queryset = KoreanWord.objects.all().prefetch_related('senses')
      queryset = queryset.filter(senses__definition__contains = search_term)

    return get_ordered_korean_search_results(queryset, self.request.user)