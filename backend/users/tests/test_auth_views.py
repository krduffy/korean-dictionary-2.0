from django.http import JsonResponse
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User


class AuthViewsTest(APITestCase):

    def setUp(self):
        self.main_username = "testusername"
        self.main_password = "testpassword"
        self.user = User.objects.create_user(
            username=self.main_username, password=self.main_password
        )

        self.login_url = reverse("login")
        self.register_url = reverse("register")
        self.refresh_url = reverse("refresh")
        self.change_password_url = reverse("change_password")
        self.access_token = str(RefreshToken.for_user(self.user).access_token)

    def access_cookie_returned(self, response: JsonResponse):
        return "access" in response.json()

    def refresh_cookie_set(self, response):
        return "refresh" in response.cookies

    def test_register_user(self):

        registration_attempts = [
            # correct usage
            {
                "username": "unused",
                "password1": "validpassword",
                "password2": "validpassword",
                "expected_status": status.HTTP_200_OK,
            },
            # username already in use
            {
                "username": "testusername",
                "password1": "validpassword",
                "password2": "validpassword",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
            # password is too short
            {
                "username": "unused",
                "password1": "short",
                "password2": "short",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
        ]

        for attempt in registration_attempts:
            with self.subTest(case=attempt):
                num_users_before = len(User.objects.all())
                response = self.client.post(self.register_url, attempt)
                num_users_after = len(User.objects.all())

                self.assertEqual(response.status_code, attempt["expected_status"])

                if attempt["expected_status"] == status.HTTP_200_OK:
                    self.assertEqual(num_users_after, 1 + num_users_before)
                    self.assertTrue(
                        User.objects.filter(username=attempt["username"]).exists()
                    )
                    self.assertTrue(self.access_cookie_returned(response))
                    self.assertTrue(self.refresh_cookie_set(response))
                else:
                    self.assertEqual(num_users_after, num_users_before)
                    self.assertFalse(self.access_cookie_returned(response))
                    self.assertFalse(self.refresh_cookie_set(response))

    def test_login(self):
        login_attempts = [
            # correct credentials
            {
                "username": "testusername",
                "password": "testpassword",
                "expected_status": status.HTTP_200_OK,
            },
            # username correct, password incorrect
            {
                "username": "testusername",
                "password": "wrongpassword",
                "expected_status": status.HTTP_401_UNAUTHORIZED,
            },
            # username incorrect, password correct
            {
                "username": "wrongusername",
                "password": "testpassword",
                "expected_status": status.HTTP_401_UNAUTHORIZED,
            },
            # username missing
            {
                "password": "whynousername",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
            # password missing
            {
                "username": "whynopassword",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
            # username blank
            {
                "username": "",
                "password": "testpassword",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
            # password blank
            {
                "username": "testusername",
                "password": "",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
        ]

        for attempt in login_attempts:
            with self.subTest(case=attempt):
                response = self.client.post(self.login_url, attempt)

                self.assertEqual(response.status_code, attempt["expected_status"])
                if attempt["expected_status"] == status.HTTP_200_OK:
                    self.assertTrue(self.access_cookie_returned(response))
                    self.assertTrue(self.refresh_cookie_set(response))
                else:
                    self.assertFalse(self.access_cookie_returned(response))
                    self.assertFalse(self.refresh_cookie_set(response))

    def test_refresh_access_token(self):
        self.client.cookies.load({"refresh": str(RefreshToken.for_user(self.user))})
        response = self.client.post(self.refresh_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.access_cookie_returned(response))

    def test_refresh_token_missing(self):
        response = self.client.post(self.refresh_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["detail"], "A refresh token was not sent.")
        self.assertFalse(self.access_cookie_returned(response))

    def test_change_password(self):
        self.client.force_authenticate(user=self.user)
        change_attempts = [
            # correct usage
            {
                "old_password": "testpassword",
                "new_password1": "newpassword123",
                "new_password2": "newpassword123",
                "expected_status": status.HTTP_200_OK,
            },
            # provided username incorrect
            {
                "old_password": "wrongpassword",
                "new_password1": "newpassword456",
                "new_password2": "newpassword456",
                "expected_status": status.HTTP_400_BAD_REQUEST,
            },
        ]

        for attempt in change_attempts:
            with self.subTest(case=attempt):
                response = self.client.post(self.change_password_url, attempt)
                self.assertEqual(response.status_code, attempt["expected_status"])
                if attempt["expected_status"] == status.HTTP_200_OK:
                    self.assertTrue(self.user.check_password(attempt["new_password1"]))
                    login_response = self.client.post(
                        self.login_url,
                        {
                            "username": self.main_username,
                            "password": attempt["new_password1"],
                        },
                    )
                    self.assertEqual(login_response.status_code, status.HTTP_200_OK)
                else:
                    self.assertFalse(self.user.check_password(attempt["new_password1"]))
