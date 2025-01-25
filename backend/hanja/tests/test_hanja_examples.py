from django.urls import reverse

from rest_framework.test import APITestCase

from dictionary_test_fixtures.db_data_mixin import DbDataMixin
from dictionary_test_fixtures.word_utils_mixin import WordUtilsMixin


class HanjaExampleTests(DbDataMixin, WordUtilsMixin, APITestCase):
    """Tests for hanja example search functionality"""

    def setUp(self):
        pass
        # 한국, 중국, 영국 are in the test fixture sample data
        # all of the data is already read in by the db data mixin.
        # Hanja in the dictionary (with pks) are
        #  元,    兔,     女,    狙,    禁,    金
        # 20803, 20820, 22899, 29401, 31105, 37329

        # Korean 한자어 words in the dictionary (with pks) are (excluding 한국(寒菊))
        #  국(國), 영국(英國), 중국(中國), 한국(韓國),
        #  108343, 665734,    859182,    1027009
        self.국 = 108343
        self.영국 = 665734
        self.중국 = 859182
        self.한국 = 1027009

        self.nonexistent_pk = "火"
        self.existent_pk = "國"

    def construct_examples_url(self, character):
        return reverse("hanja_examples", kwargs={"pk": character})

    def test_none_for_nonexistent(self):

        url = self.construct_examples_url(self.nonexistent_pk)
        response = self.client.get(url)

        # still 200, just empty results list
        self.assertEqual(response.status_code, 200)

        response_json = response.json()

        self.assertIn("results", response_json)
        self.assertEqual(len(response_json["results"]), 0)

    def assert_four_exact_results(self, results_array):
        url = self.construct_examples_url(self.existent_pk)
        response = self.client.get(url)

        # still 200, just empty results list
        self.assertEqual(response.status_code, 200)

        response_json = response.json()

        self.assertIn("results", response_json)
        self.assertEqual(len(response_json["results"]), 4)

        error_string = ", ".join(data["word"] for data in response_json["results"])

        for i in range(4):
            observed_word_pk = response_json["results"][i]["target_code"]
            self.assertEqual(
                observed_word_pk,
                results_array[i],
                "The order returned was " + error_string,
            )

    def test_order_no_manipulations(self):
        # 국 first because shortest
        # 영국 next because ㅇ > ㅈ in 가나다순
        # 중국 next because ㅈ > ㅎ in 가나다순
        # 한국 last
        exact_order_expected = [self.국, self.영국, self.중국, self.한국]

        self.assert_four_exact_results(exact_order_expected)

    def test_studied_to_top(self):
        self.studied_headwords_addall(self.regular_user, [self.중국])
        self.client.force_authenticate(self.regular_user)

        # 중국 first because known
        # 국 second because shortest
        # 영국 next because ㅇ > ㅎ in 가나다순
        # 한국 last
        exact_order_expected = [self.중국, self.국, self.영국, self.한국]

        self.assert_four_exact_results(exact_order_expected)

    def test_studied_before_known(self):
        self.known_headwords_addall(self.regular_user, [self.영국])
        self.studied_headwords_addall(self.regular_user, [self.한국])

        self.client.force_authenticate(user=self.regular_user)

        # 한국 first because it is studied
        # 영국 second because it is known
        # 국 third, 중국 fourth due to their lengths
        expected_order = [self.한국, self.영국, self.국, self.중국]
        self.assert_four_exact_results(expected_order)

    def test_known_before_users_that_know(self):
        self.known_headwords_addall(self.regular_user, [self.영국])
        self.known_headwords_addall(self.staff, [self.영국])

        self.known_headwords_addall(self.second_regular_user, [self.한국])

        self.client.force_authenticate(user=self.second_regular_user)

        # 한국 first because the user knows it (despite 2 ppl knowing 영국)
        # 영국 second 2 people know it
        # 국 third, 중국 last due to length
        expected_order = [self.한국, self.영국, self.국, self.중국]
        self.assert_four_exact_results(expected_order)

    def test_users_that_know_before_alphabetical(self):
        self.known_headwords_addall(self.regular_user, [self.중국])

        # not the same user that knows the word 중국
        self.client.force_authenticate(user=self.staff)

        # first is 중국 because one person knows it
        # then 국, 영국, 한국 due to length + alphabetical order
        expected_order = [self.중국, self.국, self.영국, self.한국]
        self.assert_four_exact_results(expected_order)
