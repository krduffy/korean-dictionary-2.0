from django.urls import path
from users.auth_views import LoginView, RefreshAccessView, RegisterView, ChangePasswordView
from users.views import RetrieveUserView

urlpatterns = [
  path('auth/login', LoginView.as_view(), name='login'),
  path('auth/refresh', RefreshAccessView.as_view(), name='refresh'),
  path('auth/register', RegisterView.as_view(), name='register'),
  path('auth/change_password', ChangePasswordView.as_view(), name='change_password'),

  path('my_info', RetrieveUserView.as_view()),
]

