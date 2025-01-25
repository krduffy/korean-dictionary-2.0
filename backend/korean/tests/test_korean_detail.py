from django.urls import reverse

from rest_framework.test import APITestCase

from dictionary_test_fixtures.db_data_mixin import DbDataMixin


class KoreanDetailTests(DbDataMixin, APITestCase):
    """Tests for word search functionality"""

    def setUp(self):
        """Set up data for each test method"""

        self.existent_pk = 29
        self.nonexistent_pk = 0

    def construct_detail_url(self, target_code):
        return reverse("korean_detail", kwargs={"pk": target_code})

    def test_200_on_existent(self):

        url = self.construct_detail_url(self.existent_pk)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_404_on_nonexistent(self):

        url = self.construct_detail_url(self.nonexistent_pk)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)
