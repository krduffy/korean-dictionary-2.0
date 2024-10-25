from django.contrib.auth import get_user_model
from django.urls import reverse
from words.models import HanjaCharacter, HanjaMeaningReading
from rest_framework.test import APITestCase

from users.models import User
from words.tests.fixtures.db_data_mixin import DbDataMixin

class WordSearchTests(DbDataMixin, APITestCase):
  """Tests for word search functionality"""
  
  def setUp(self):
    """Set up data for each test method"""
    self.search_url = reverse('search_korean')

    self.filler_search_term = "가"
    self.filler_search_type = "word_exact"
  
  def test_search_type_param_unauthenticated(self):

    allowed_search_types = ["word_exact", "definition_contains"]
    
    for search_type in allowed_search_types:
      with self.subTest(case = search_type):
        response = self.client.get(self.search_url, {
          "search_term": self.filler_search_term,
          "search_type": search_type
        })
    
        self.assertEqual(response.status_code, 200)

    unallowed_search_types = ["word_regex", "not_valid"]

    for search_type in unallowed_search_types:
      with self.subTest(case = search_type):
        response = self.client.get(self.search_url, {
          "search_term": self.filler_search_term,
          "search_type": search_type
        })
    
        self.assertEqual(response.status_code, 400)

  def test_search_type_param_staff(self):

    self.client.force_authenticate(user=self.staff)

    allowed_search_types = ["word_exact", "definition_contains", "word_regex"]
    
    for search_type in allowed_search_types:
      with self.subTest(case = search_type):
        response = self.client.get(self.search_url, {
          "search_term": "가",
          "search_type": search_type
        })
    
        self.assertEqual(response.status_code, 200)

    unallowed_search_types = ["not_valid"]

    for search_type in unallowed_search_types:
      with self.subTest(case = search_type):
        response = self.client.get(self.search_url, {
          "search_term": "가",
          "search_type": search_type
        })
    
        self.assertEqual(response.status_code, 400)

  def test_search_term_param(self):
    
    successful_terms = ["검색어"]
    for term in successful_terms:
      with self.subTest(case = term):
        success_response = self.client.get(self.search_url, {
          "search_term": term,
          "search_type": self.filler_search_type
        })

        self.assertEqual(success_response.status_code, 200)

    unsuccessful_terms = [""]
    for term in unsuccessful_terms:
      with self.subTest(case = term):
        success_response = self.client.get(self.search_url, {
          "search_term": term,
          "search_type": self.filler_search_type
        })

        self.assertEqual(success_response.status_code, 400)
        
  def test_get_word_exact(self):

    cases = [
      {
        "word": "ㄴ가",
        "expected_count": 2,
        # base case; only target code should come into account
        "expected_results_order": [29, 30]
      }
    ]

    for case in cases:
      with self.subTest(case = case):
        success_response = self.client.get(self.search_url, {
          "search_term": case['word'],
          "search_type": "word_exact"
        })

        self.assertEqual(success_response.status_code, 200)

        response_data = success_response.json()
        
        self.assertEqual(response_data['count'], case['expected_count'])
        results = response_data['results']
        for i in range (response_data['count']):
          observed = results[i]['target_code']
          expected = case['expected_results_order'][i]
          self.assertEqual(observed, expected)