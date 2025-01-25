import os
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

from korean.models import KoreanHeadword
from hanja.models import HanjaCharacter


# Where the user's images are placed .


def get_image_path(instance, filename):
    # example path may be MEDIAROOT/userid_1/myimage.png
    _, ext = os.path.splitext(filename)
    new_filename = uuid.uuid4().hex + ext
    return f"user{instance.user_ref.pk}/{new_filename}"


class User(AbstractUser):
    known_headwords = models.ManyToManyField(
        to=KoreanHeadword, related_name="users_that_know"
    )
    known_hanja = models.ManyToManyField(
        to=HanjaCharacter, related_name="users_that_know"
    )

    studied_headwords = models.ManyToManyField(
        to=KoreanHeadword, related_name="users_that_study"
    )
    studied_hanja = models.ManyToManyField(
        to=HanjaCharacter, related_name="users_that_study"
    )
