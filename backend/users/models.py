from django.db import models
from django.contrib.auth.models import AbstractUser

from words.models import KoreanWord, HanjaCharacter

import os
import uuid


class User(AbstractUser):
    known_words = models.ManyToManyField(to=KoreanWord, related_name="users_that_know")
    known_hanja = models.ManyToManyField(
        to=HanjaCharacter, related_name="users_that_know"
    )

    studied_words = models.ManyToManyField(
        to=KoreanWord, related_name="users_that_study"
    )
    studied_hanja = models.ManyToManyField(
        to=HanjaCharacter, related_name="users_that_study"
    )


def get_image_path(instance, filename):
    # example path may be MEDIAROOT/userid_1/myimage.png
    _, ext = os.path.splitext(filename)
    new_filename = uuid.uuid4().hex + ext
    return f"user{instance.user_ref.pk}/{new_filename}"


class UserImage(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_images", null=False
    )
    word_ref = models.ForeignKey(
        KoreanWord, on_delete=models.CASCADE, related_name="user_images", null=False
    )

    image_accompanying_text = models.CharField(null=True)
    image = models.ImageField(upload_to=get_image_path, null=False)

    source = models.CharField(max_length=1000, null=False)


class UserExampleSentence(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_sentences", null=False
    )
    word_ref = models.ForeignKey(
        KoreanWord, on_delete=models.CASCADE, related_name="user_sentences", null=False
    )

    sentence = models.CharField(max_length=1000, null=False)
    source = models.CharField(max_length=1000, null=False)


class UserVideoExample(models.Model):
    id = models.BigAutoField(primary_key=True)

    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_videos", null=False
    )
    word_ref = models.ForeignKey(
        KoreanWord, on_delete=models.CASCADE, related_name="user_videos", null=False
    )

    # url of the video
    video_url = models.URLField(null=False)

    # time in the video at which the relevant clip starts
    time = models.IntegerField(null=True)

    # accompanying text shown along with the video
    video_text = models.CharField(null=True)

    source = models.CharField(max_length=1000, null=False)
