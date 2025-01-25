from django.db import DataError, models


class HanjaCharacter(models.Model):
    # This character. 金, 韓, 朴, 安 are examples of what might be in this field.
    character = models.CharField(primary_key=True, max_length=1)

    # 이 한자의 모양자 분해. '⿱逢？'는 예일 수 있다.
    decomposition = models.CharField(null=True)

    # 이 한자의 부수. 예를 들어서 災 재앙 재의 부수는 火입니다
    # 부수는 분해 중에 반드시 있을 겁니다.
    radical = models.CharField(null=True)
    radical_source = models.CharField(null=True)

    # 이 한자의 획수.
    strokes = models.SmallIntegerField(null=True, default=None)

    # 고등학교, 미배정이 예일 수 있습니다
    grade_level = models.CharField(null=False)

    # 한국의 한자 검정시험 기준으로, 이 한자의 급. 8급 등이 있습니다.
    exam_level = models.CharField(null=False)

    # 검색할 때 이 한자의 비중. exam_level 높을수록 이 변수도 높아집니다
    result_ranking = models.SmallIntegerField(null=False, default=-1)

    explanation = models.CharField(null=True)

    def __str__(self):
        return self.character


# 훈음
class HanjaMeaningReading(models.Model):
    referent = models.ForeignKey(
        to=HanjaCharacter,
        related_name="meaning_readings",
        on_delete=models.CASCADE,
        null=False,
    )
    meaning = models.CharField(max_length=100, null=False)
    # should not be null but there could be one added in the future hypothetically
    readings = models.CharField(max_length=3, null=True)

    def save(self, *args, **kwargs):
        try:
            super().save(*args, **kwargs)
        except DataError as e:
            print(f"Failed to save with data: {self.__dict__}")
            raise

    def __str__(self):
        return f'{self.meaning} ({"/".join(char for char in self.readings)})'
