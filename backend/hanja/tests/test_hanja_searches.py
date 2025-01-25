from django.urls import reverse
from hanja.models import HanjaCharacter
from rest_framework.test import APITestCase

from dictionary_test_fixtures.db_data_mixin import DbDataMixin


class HanjaSearchTests(DbDataMixin, APITestCase):
    """Tests for hanja search functionality"""

    def setUp(self):
        """Set up data for each test method"""
        self.search_url = reverse("hanja_search")

        self.filler_search_term = "가"

    def test_filter_params(self):

        param_tests = {
            "decomposition": {
                "valid": ["⿱", "林林林"],
                "invalid": ["thisiswaytoolongandwouldnevermatchanything"],
            },
            "radical": {"valid": ["示", "A"], "invalid": ["AA"]},
            "strokes": {
                "valid": ["eq17", "lte4"],
                "invalid": ["gtenotnum", "not7.", "toolongofaparam"],
            },
            "grade_level": {
                "valid": ["고등학교", "미배정"],
                "invalid": ["있으려나", "없을걸"],
            },
            "result_ranking": {
                "valid": ["gte0", "not14", "eq11"],
                "invalid": [
                    "ltwhereisnum",
                    "norelop",
                    "thisiswaytoolong",
                    "gte!notalevel!",
                ],
            },
            "nonexistent_filter": {"valid": [], "invalid": ["cannot match"]},
        }

        for param, values_dict in param_tests.items():

            for valid_value in values_dict["valid"]:

                with self.subTest(case=f"param={param}, value={valid_value}"):
                    response = self.client.get(
                        self.search_url,
                        {"search_term": self.filler_search_term, param: valid_value},
                    )

                    self.assertEqual(response.status_code, 200)

            for invalid_value in values_dict["invalid"]:

                with self.subTest(case=f"param={param}, value={invalid_value}"):
                    response = self.client.get(
                        self.search_url,
                        {"search_term": self.filler_search_term, param: invalid_value},
                    )

                    self.assertEqual(response.status_code, 400)

    def test_search_hanja_reading_before_meaning(self):

        response = self.client.get(self.search_url, {"search_term": "원"})

        expected_count = 2
        expected_results_order = ["元", "狙"]

        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json["count"], expected_count)
        for i in range(response_json["count"]):
            self.assertEqual(
                response_json["results"][i]["character"], expected_results_order[i]
            )

    def test_search_hanja_reading_meaning_order(self):

        response = self.client.get(self.search_url, {"search_term": "김"})

        expected_count = 2
        # pks are [37329, 20820]
        # 김 has been forced onto the meaning of 토끼 토.
        # 성 김 should be first since it is in the reading
        expected_results_order = ["金", "兔"]

        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json["count"], expected_count)
        for i in range(response_json["count"]):
            self.assertEqual(
                response_json["results"][i]["character"], expected_results_order[i]
            )

    def test_search_hanja_meaning_before_explanation(self):

        response = self.client.get(self.search_url, {"search_term": "금할"})

        expected_count = 2
        # pks are [31105, 20820]
        # 금할 has been added to the explanation of 토끼 토.
        # '금할 금' is the first so 금할 is in the meaning
        expected_results_order = ["禁", "兔"]

        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json["count"], expected_count)
        for i in range(response_json["count"]):
            self.assertEqual(
                response_json["results"][i]["character"], expected_results_order[i]
            )
