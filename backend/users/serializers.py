from rest_framework import serializers
from users.models import User, UserImage, UserExampleSentence, UserVideoExample


class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImage
        fields = ["id", "image_accompanying_text", "image_url", "source"]


class UserExampleSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExampleSentence
        fields = ["id", "sentence", "source"]


class UserVideoExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVideoExample
        fields = ["id", "video_url", "video_text", "time", "source"]
