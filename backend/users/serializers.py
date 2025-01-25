from rest_framework import serializers
from backend.settings import BASE_URL
from users.models import User, UserImage, UserExampleSentence, UserVideoExample


class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = UserImage
        fields = ["id", "image_accompanying_text", "image_url", "source"]

    def get_image_url(self, obj):
        # copied from code serializer for lemma deriving text
        # for user image, both fields cannot be None
        """Gets a single image url from the model object. If there is an uploaded
        image (`image` column; has server's origin) then it returns only that.
        If there is a remote image url then it returns that. If neither exists,
        it returns None."""

        nonremote_image_url = obj.nonremote_image_url
        if nonremote_image_url:
            # Is ImageField
            return BASE_URL + nonremote_image_url.url

        remote_image_url = obj.remote_image_url
        if remote_image_url:
            # Is CharField
            return remote_image_url

        # keeping it like this for development; this is not caught anywhere
        raise Exception("Image has neither nonremote nor remote image url")


class UserExampleSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExampleSentence
        fields = ["id", "sentence", "source"]


class UserVideoExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVideoExample
        fields = ["id", "video_id", "video_text", "start", "end", "source"]
