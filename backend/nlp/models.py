from django.db import models
from words.models import KoreanWord
from users.models import User, get_image_path


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
