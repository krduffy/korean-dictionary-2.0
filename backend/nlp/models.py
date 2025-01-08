from django.db import models
from words.models import KoreanWord
from users.models import User


class DerivedExampleText(models.Model):
    text = models.TextField()
    source = models.CharField()
    user_that_added = models.ForeignKey(
        to=User, related_name="derived_example_texts", on_delete=models.CASCADE
    )


class DerivedExampleLemma(models.Model):
    source_text = models.ForeignKey(
        to=DerivedExampleText,
        related_name="derived_example_lemmas",
        on_delete=models.CASCADE,
    )

    lemma = models.CharField()
    word_ref = models.ForeignKey(to=KoreanWord, null=True, on_delete=models.CASCADE)

    start_index_in_source_text = models.IntegerField()
    end_index_in_source_text = models.IntegerField()
