from django.db import models


class KoreanHeadword(models.Model):
    # Needs to be manually set because of links that are encoded in
    # the dictionary data json files
    target_code = models.IntegerField(primary_key=True)

    # This word and its origin.
    # For example, word can be 단어 while origin is 單語
    word = models.CharField(max_length=100, null=False, db_index=True)
    origin = models.CharField(max_length=100, null=True)

    # Called word_unit in dictionary JSON files.
    # 'word_type' as defined in those files is both rarely useful and easily calculable using
    # the Unicode values of self.origin. 어휘, 속담, ...
    word_type = models.CharField(max_length=3, null=True)

    history_info = models.JSONField(null=True, default=None)

    result_ranking = models.SmallIntegerField(null=False, default=0)

    class Meta:
        indexes = [models.Index(fields=["word"], name="index_korean_word_word")]

    @property
    def first_sense(self):
        return self.senses.order_by("order").first()

    @property
    def first_five_senses(self):
        return self.senses.order_by("order")[:5]

    @property
    def all_senses(self):
        return self.senses.order_by("order")

    def __str__(self):
        return f"{self.word} ({self.pk})"


class Sense(models.Model):
    # The unique identifier for this sense. Needs to be manually set
    # because of links that are encoded in the dictionary data json files
    target_code = models.IntegerField(primary_key=True)

    # The headword that this sense refers to.
    headword_ref = models.ForeignKey(
        KoreanHeadword, on_delete=models.CASCADE, related_name="senses", null=False
    )

    # The definition (meaning) associated with this sense.
    definition = models.CharField(max_length=1500, null=False)

    # The kind of meaning that this sense's definition falls under.
    # Examples include dialectal
    type = models.CharField(max_length=3, null=True)

    # The placement of this sense among all of the senses that refer to this sense's referent.
    order = models.SmallIntegerField(null=False)

    # The category (sports, science, ...) that this sense is related to.
    category = models.CharField(
        max_length=6, null=True
    )  # longest is six, tie including '고유명 일반'

    # Part of speech
    pos = models.CharField(max_length=6, null=True)

    # JSON field for optional additional data.
    # Seven possible contained fields below
    additional_info = models.JSONField(null=True, default=None)
    # patterns, relations, examples, norms, grammar, proverb, region

    def __str__(self):
        return f"{self.definition[:20]} ({self.pk})"


# This is separated from the rest of additional_info for faster queries
class SenseExample(models.Model):
    sense_ref = models.ForeignKey(
        Sense, on_delete=models.CASCADE, related_name="examples", null=False
    )

    example = models.CharField(null=False)
    source = models.CharField(null=True)

    # Usually for when the example is dialect
    # and it is rewritten in standard korean
    translation = models.CharField(null=True)

    origin = models.CharField(null=True)
    region = models.CharField(null=True)
