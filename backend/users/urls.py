from django.urls import path
from users.auth_views import LoginView, RefreshAccessView
from users.views import RetrieveUserView

urlpatterns = [
  path('auth/login', LoginView.as_view()),
  path('auth/refresh', RefreshAccessView.as_view()),

  path('my_info', RetrieveUserView.as_view()),
]

