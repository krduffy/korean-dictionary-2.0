from django.urls import reverse
from words.models import KoreanWord
from rest_framework.test import APITestCase

from words.tests.fixtures.db_data_mixin import DbDataMixin

class KoreanWordSearchTests(DbDataMixin, APITestCase):
  """Tests for word search functionality"""
  
  def setUp(self):
    """Set up data for each test method"""
    self.search_url = reverse('korean_search')

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
      },
      {
        "word": "가",
        "expected_count": 1,
        # because word exact only '가' should match despite every word ending in '가'
        "expected_results_order": [517]
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

  def test_get_word_exact_while_studied(self):

    case = {
      "word": "ㄴ가",
      "expected_count": 2,
      # word with pk 30 is being studied by authenticated user.
      "expected_results_order": [30, 29]
    }

    studied_word = KoreanWord.objects.get(pk = 30)
    self.regular_user.studied_words.add(studied_word)

    self.client.force_authenticate(user = self.regular_user)

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
  
  def test_get_word_exact_while_another_user_knows(self):

    case = {
      "word": "ㄴ가",
      "expected_count": 2,
      # word with pk 30 is known by the staff user, so for the regular user it should be first.
      "expected_results_order": [30, 29]
    }

    known_word = KoreanWord.objects.get(pk = 30)
    self.staff.known_words.add(known_word)

    self.client.force_authenticate(user = self.regular_user)

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
  
  def test_get_word_exact_hanja_search(self):

    case = {
      "word": "韓國",
      "expected_count": 1,
      # there are 2 words '한국' but only one has this origin of 나라이름 韓 나라 國.
      "expected_results_order": [1027009]
    }

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

  def test_get_word_exact_shorter_first(self):

    case = {
      "word": "ㄹ*가",
      "expected_count": 3,
      # 517 is 가, 142 and 143 are ㄹ가. 142 is lower than 143 pk wise so it is first
      "expected_results_order": [517, 142, 143]
    }

    self.client.force_authenticate(user = self.staff)

    success_response = self.client.get(self.search_url, {
      "search_term": case['word'],
      "search_type": "word_regex"
    })

    self.assertEqual(success_response.status_code, 200)

    response_data = success_response.json()
      
    self.assertEqual(response_data['count'], case['expected_count'])
    results = response_data['results']
    for i in range (response_data['count']):
      observed = results[i]['target_code']
      expected = case['expected_results_order'][i]
      self.assertEqual(observed, expected)