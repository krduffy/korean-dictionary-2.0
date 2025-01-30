from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework.status import HTTP_200_OK
from dictionary_test_fixtures.db_data_mixin import DbDataMixin


class KnownUnknownTests(DbDataMixin, APITestCase):
    """Tests for setting words and hanja characters as known or unknown."""

    def setUp(self):
        self.tested_word_pk = 517
        self.tested_hanja_pk = "金"

    def construct_url_with_pk(self, pk):
        return reverse("update_known_studied", kwargs={"pk": pk})

    def send_request_then_check(
        self,
        user,
        korean_or_hanja,
        known_or_studied,
        set_true_or_false,
        response_status,
    ):
        self.client.force_authenticate(user=user)
        test_pk = (
            self.tested_word_pk if korean_or_hanja == "korean" else self.tested_hanja_pk
        )
        url = self.construct_url_with_pk(test_pk)

        response = self.client.put(
            url,
            {
                "korean_or_hanja": korean_or_hanja,
                "known_or_studied": known_or_studied,
                "set_true_or_false": set_true_or_false,
            },
        )

        self.assertEqual(response.status_code, response_status)
        self.regular_user.refresh_from_db()

        if response.status_code == HTTP_200_OK:
            assertion_func = self.assertIn if set_true_or_false else self.assertNotIn
            user_model_field = None
            if korean_or_hanja == "korean":
                user_model_field = (
                    user.known_headwords
                    if known_or_studied == "known"
                    else user.studied_headwords
                )
            elif korean_or_hanja == "hanja":
                user_model_field = (
                    user.known_hanja
                    if known_or_studied == "known"
                    else user.studied_hanja
                )
            user_model_field_pks = user_model_field.values_list("pk", flat=True)

            assertion_func(test_pk, user_model_field_pks)

    def verify_counts(self, user, counts):
        if len(counts) != 4:
            self.fail("The length of counts must be 4")

        self.assertEqual(self.regular_user.known_headwords.count(), counts[0])
        self.assertEqual(self.regular_user.studied_headwords.count(), counts[1])
        self.assertEqual(self.regular_user.known_hanja.count(), counts[2])
        self.assertEqual(self.regular_user.studied_hanja.count(), counts[3])

    def test_setting_word_known(self):
        user = self.regular_user

        self.send_request_then_check(user, "korean", "known", True, HTTP_200_OK)

        self.verify_counts(user, [1, 0, 0, 0])

    def test_setting_word_known_idempotent(self):
        user = self.regular_user

        self.verify_counts(user, [0, 0, 0, 0])

        self.send_request_then_check(user, "korean", "known", True, HTTP_200_OK)
        self.verify_counts(user, [1, 0, 0, 0])

        # Do the same thing again .
        self.send_request_then_check(user, "korean", "known", True, HTTP_200_OK)
        self.verify_counts(user, [1, 0, 0, 0])

    def test_setting_word_known_then_unknown(self):
        user = self.regular_user

        self.verify_counts(user, [0, 0, 0, 0])

        self.send_request_then_check(user, "korean", "known", True, HTTP_200_OK)
        self.verify_counts(user, [1, 0, 0, 0])

        # Do the same thing again .
        self.send_request_then_check(user, "korean", "known", False, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 0, 0])

    def test_setting_word_unknown_when_already_unknown(self):
        user = self.regular_user

        self.verify_counts(user, [0, 0, 0, 0])

        # Do the same thing again .
        self.send_request_then_check(user, "korean", "known", False, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 0, 0])

    def test_setting_word_studied(self):
        user = self.regular_user

        self.send_request_then_check(user, "korean", "studied", True, HTTP_200_OK)
        self.verify_counts(user, [0, 1, 0, 0])

    def test_setting_word_known_then_studied(self):
        user = self.regular_user

        self.send_request_then_check(user, "korean", "known", True, HTTP_200_OK)
        self.verify_counts(user, [1, 0, 0, 0])
        self.send_request_then_check(user, "korean", "studied", True, HTTP_200_OK)
        self.verify_counts(user, [1, 1, 0, 0])

    def test_setting_word_not_studied_when_already_not_studied(self):
        user = self.regular_user

        self.send_request_then_check(user, "korean", "studied", False, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 0, 0])

    def test_setting_hanja_known(self):
        user = self.regular_user

        self.send_request_then_check(user, "hanja", "known", True, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 1, 0])

    def test_setting_hanja_studied(self):
        user = self.regular_user

        self.send_request_then_check(user, "hanja", "studied", True, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 0, 1])

    def test_setting_hanja_known_and_studied_then_not_known(self):
        user = self.regular_user

        self.send_request_then_check(user, "hanja", "known", True, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 1, 0])

        self.send_request_then_check(user, "hanja", "studied", True, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 1, 1])

        self.send_request_then_check(user, "hanja", "known", False, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 0, 1])

    def test_setting_both_known_and_studied_then_undone(self):
        user = self.regular_user

        self.send_request_then_check(user, "korean", "known", True, HTTP_200_OK)
        self.verify_counts(user, [1, 0, 0, 0])
        self.send_request_then_check(user, "korean", "studied", True, HTTP_200_OK)
        self.verify_counts(user, [1, 1, 0, 0])
        self.send_request_then_check(user, "hanja", "known", True, HTTP_200_OK)
        self.verify_counts(user, [1, 1, 1, 0])
        self.send_request_then_check(user, "hanja", "studied", True, HTTP_200_OK)
        self.verify_counts(user, [1, 1, 1, 1])

        self.send_request_then_check(user, "hanja", "studied", False, HTTP_200_OK)
        self.verify_counts(user, [1, 1, 1, 0])
        self.send_request_then_check(user, "korean", "studied", False, HTTP_200_OK)
        self.verify_counts(user, [1, 0, 1, 0])
        self.send_request_then_check(user, "korean", "known", False, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 1, 0])
        self.send_request_then_check(user, "hanja", "known", False, HTTP_200_OK)
        self.verify_counts(user, [0, 0, 0, 0])
