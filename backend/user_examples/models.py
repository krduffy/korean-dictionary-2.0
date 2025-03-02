from django.db import models
from backend.settings import BASE_URL
from korean.models import KoreanHeadword
from users.models import User, get_image_path


class UserImage(models.Model):

    id = models.BigAutoField(primary_key=True)
    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_images", null=False
    )
    headword_ref = models.ForeignKey(
        KoreanHeadword, on_delete=models.CASCADE, related_name="user_images", null=False
    )

    image_accompanying_text = models.CharField(blank=True, default="")

    image_url = models.ImageField(upload_to=get_image_path, null=False)
    source = models.CharField(max_length=1000, null=False)


class UserExampleSentence(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_sentences", null=False
    )
    headword_ref = models.ForeignKey(
        KoreanHeadword,
        on_delete=models.CASCADE,
        related_name="user_sentences",
        null=False,
    )

    sentence = models.CharField(max_length=1000, null=False)
    source = models.CharField(max_length=1000, null=False)


class UserVideoExample(models.Model):
    id = models.BigAutoField(primary_key=True)

    user_ref = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="added_videos", null=False
    )
    headword_ref = models.ForeignKey(
        KoreanHeadword, on_delete=models.CASCADE, related_name="user_videos", null=False
    )

    # (youtube) video id for the video
    video_id = models.CharField(null=False)

    # time in the video at which the relevant clip starts and ends
    start = models.IntegerField(null=False)
    end = models.IntegerField(null=False)

    # accompanying text shown along with the video
    # can add context, notes, ...
    video_text = models.CharField(blank=True, default="")

    source = models.CharField(max_length=1000, null=False)


class DerivedExampleText(models.Model):
    text = models.TextField()
    source = models.CharField()
    user_ref = models.ForeignKey(
        to=User, related_name="derived_example_texts", on_delete=models.CASCADE
    )

    image_url = models.ImageField(null=True, upload_to=get_image_path)

    @property
    def base_appended_image_url(self):
        image_url = self.image_url
        if image_url:
            return BASE_URL + image_url.url
        return None


class DerivedExampleLemma(models.Model):
    source_text = models.ForeignKey(
        to=DerivedExampleText,
        related_name="derived_example_lemmas",
        on_delete=models.CASCADE,
    )

    lemma = models.CharField()
    headword_ref = models.ForeignKey(
        to=KoreanHeadword,
        related_name="derived_example_lemmas",
        null=True,
        on_delete=models.CASCADE,
    )

    eojeol_number_in_source_text = models.IntegerField()

    @property
    def image_url(self):
        image_url = self.source_text.image_url
        if image_url:
            return BASE_URL + image_url.url
        return None

    @property
    def source_text_preview(self) -> str:
        """Gets a preview of the source text, showing the portion
        of the text in which this lemma appears"""
        full_text = self.source_text.text

        tokenized = full_text.split()

        central_eojeol_num = self.eojeol_number_in_source_text
        tokens_around_central_shown = 10

        starting_index = central_eojeol_num - tokens_around_central_shown
        ending_index = central_eojeol_num + tokens_around_central_shown + 1

        context_before = "..." if starting_index > 0 else ""
        starting_index = max(starting_index, 0)
        context_before += " ".join(tokenized[starting_index:central_eojeol_num])
        if len(context_before) > 0:
            context_before += " "

        context_after_final = "..." if ending_index < len(tokenized) else ""
        ending_index = min(ending_index, len(tokenized))
        context_after = " ".join(tokenized[central_eojeol_num + 1 : ending_index])
        context_after += context_after_final

        ending_target_span = "[/TGT]" if len(context_after) == 0 else "[/TGT] "

        return (
            context_before
            + "[TGT]"
            + tokenized[central_eojeol_num]
            + ending_target_span
            + context_after
        )
