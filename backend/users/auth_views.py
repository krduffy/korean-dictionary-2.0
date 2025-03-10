from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm

from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
)
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.views import APIView

from users.models import User


def get_token_response(access, refresh):
    response = JsonResponse({"access": access}, status=200)

    response.set_cookie(
        key="refresh",
        value=refresh,
        httponly=True,
        secure=True,
        samesite="None",
        # this is here but the actual age is set in settings under jwt
        max_age=1,
    )

    return response


def get_deleted_token_response():
    response = JsonResponse({"detail": "Logged out."}, status=HTTP_200_OK)

    response.delete_cookie(key="refresh", path="/")

    return response


class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data

        return get_token_response(access=tokens["access"], refresh=tokens["refresh"])


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            try:
                token_as_object = RefreshToken(refresh_token)
                token_as_object.blacklist()
            except InvalidToken:
                return Response(
                    {"detail": "Token is invalid."}, status=HTTP_400_BAD_REQUEST
                )
            except TokenError as error:
                return Response(
                    {"detail": f"A token error occurred: {error}"},
                    status=HTTP_400_BAD_REQUEST,
                )

        response = get_deleted_token_response()
        return response


class RefreshAccessView(TokenRefreshView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "A refresh token was not sent."},
                status=HTTP_401_UNAUTHORIZED,
            )

        try:
            refreshed = RefreshToken(refresh_token)
            return Response({"access": str(refreshed.access_token)}, status=HTTP_200_OK)
        except InvalidToken:
            return Response(
                {"detail": "The refresh token provided is invalid."},
                status=HTTP_401_UNAUTHORIZED,
            )
        except TokenError as error:
            return Response(
                {"detail": f"A token error occurred: {error}"},
                status=HTTP_401_UNAUTHORIZED,
            )


class RegistrationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User


class RegisterView(CreateAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        form = RegistrationForm(request.data)

        if not form.is_valid():
            return Response(form.errors, status=HTTP_400_BAD_REQUEST)

        user = form.save()
        new_tokens = RefreshToken.for_user(user)
        return get_token_response(
            access=str(new_tokens.access_token), refresh=str(new_tokens)
        )


class ChangePasswordView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        form = PasswordChangeForm(user=request.user, data=request.data)

        if not form.is_valid():
            return Response(form.errors, status=HTTP_400_BAD_REQUEST)

        form.save()
        return Response(
            {"detail": "Successfully updated password."}, status=HTTP_200_OK
        )
