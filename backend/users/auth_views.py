from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_401_UNAUTHORIZED

class LoginView(TokenObtainPairView):
  permission_classes = (AllowAny, )

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    tokens = serializer.validated_data

    response = Response({"access": tokens['access']}, status=HTTP_200_OK)

    response.set_cookie(
      key='refresh',
      value=tokens['refresh'],
      httponly=True,
      # secure False is temp for testing in localhost
      secure=False,
      samesite='None',
      # 30 seconds is for testing
      max_age=30,
    )

    return response

class RefreshAccessView(TokenRefreshView):
  permission_classes = (AllowAny, )
  
  def post(self, request, *args, **kwargs):
    refresh_token = request.COOKIES.get('refresh')

    if not refresh_token:
      return Response({"detail": "A refresh token was not sent."}, status=HTTP_401_UNAUTHORIZED)
  
    try:
      refreshed = RefreshToken(refresh_token)
      return Response({"access": str(refreshed)}, status=HTTP_200_OK)
    except InvalidToken:
      return Response({"detail": "The refresh token provided is invalid."}, status=HTTP_401_UNAUTHORIZED)
    except TokenError as error:
      return Response({"detail": f'A token error occurred: {error}'}, status=HTTP_401_UNAUTHORIZED)