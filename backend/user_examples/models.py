from django.db import models
from words.models import KoreanWord
from users.models import User, get_image_path


class UserImage(models.Model):

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(remote_image_url__isnull=False)
                | models.Q(nonremote_image_url__isnull=False),
                name="at_least_one_image_url",
            )
        ]

    id = models.BigAutoField(primary_key=True)
    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_images", null=False
    )
    word_ref = models.ForeignKey(
        KoreanWord, on_delete=models.CASCADE, related_name="user_images", null=False
    )

    image_accompanying_text = models.CharField(null=True)

    nonremote_image_url = models.ImageField(upload_to=get_image_path, null=True)
    remote_image_url = models.URLField(null=True)

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

    # (youtube) video id for the video
    video_id = models.CharField(null=False)

    # time in the video at which the relevant clip starts and ends
    start = models.IntegerField(null=False)
    end = models.IntegerField(null=False)

    # accompanying text shown along with the video
    # can add context, notes, ...
    video_text = models.CharField(null=True)

    source = models.CharField(max_length=1000, null=False)


# Create your models here.
class DerivedExampleText(models.Model):
    text = models.TextField()
    source = models.CharField()
    user_ref = models.ForeignKey(
        to=User, related_name="derived_example_texts", on_delete=models.CASCADE
    )

    nonremote_image_url = models.ImageField(null=True, upload_to=get_image_path)
    remote_image_url = models.URLField(null=True)


class DerivedExampleLemma(models.Model):
    source_text = models.ForeignKey(
        to=DerivedExampleText,
        related_name="derived_example_lemmas",
        on_delete=models.CASCADE,
    )

    lemma = models.CharField()
    word_ref = models.ForeignKey(
        to=KoreanWord,
        related_name="derived_example_lemmas",
        null=True,
        on_delete=models.CASCADE,
    )

    eojeol_number_in_source_text = models.IntegerField()
