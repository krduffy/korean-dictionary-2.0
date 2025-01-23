from django.urls import path
from users.auth_views import (
    LoginView,
    LogoutView,
    RefreshAccessView,
    RegisterView,
    ChangePasswordView,
)
from users.views import (
    RetrieveUserView,
    UpdateKnownOrStudiedView,
    AddExampleSentenceView,
    AddImageExampleView,
    AddVideoExampleView,
)

urlpatterns = [
    path("auth/login", LoginView.as_view(), name="login"),
    path("auth/logout", LogoutView.as_view(), name="logout"),
    path("auth/refresh", RefreshAccessView.as_view(), name="refresh"),
    path("auth/register", RegisterView.as_view(), name="register"),
    path("auth/change_password", ChangePasswordView.as_view(), name="change_password"),
    path("my_info", RetrieveUserView.as_view(), name="my_info"),
    path(
        "update/known_studied/<pk>",
        UpdateKnownOrStudiedView.as_view(),
        name="update_known_studied",
    ),
    path("add/video", AddVideoExampleView.as_view(), name="add_video"),
    path("add/sentence", AddExampleSentenceView.as_view(), name="add_sentence"),
    path("add/image", AddImageExampleView.as_view(), name="add_image"),
]
