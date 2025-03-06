from rest_framework import serializers
from users.models import User


class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "is_staff"]
