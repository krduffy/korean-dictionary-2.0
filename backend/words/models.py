from django.db import models

class KoreanWord(models.Model):
  # A "word" is a group of senses that allude to the same fundamental meaning.
  target_code = models.IntegerField(primary_key = True)
  
  # This word and its origin.
  # For example, word can be 단어 while origin is 單語
  word = models.CharField(max_length = 100, null=False)
  origin = models.CharField(max_length = 100, null=True)
  
  # Called word_unit in dictionary JSON files.
  # 'word_type' as defined in those files is both rarely useful and easily calculable using
  # the Unicode values of self.origin. 어휘, 속담, ...
  word_type = models.CharField(max_length = 3, null=True)

  history_info = models.JSONField(null = True, default=None)
  
class Sense(models.Model):
  # The unique identifier for this sense.
  target_code = models.IntegerField(primary_key = True)

  # The word that this sense refers to.
  referent = models.ForeignKey(KoreanWord, on_delete = models.CASCADE, related_name = "senses",
                               null=False)
 
  # The definition (meaning) associated with this sense.
  definition = models.CharField(max_length = 1500, null=False)
  
  # The kind of meaning that this sense's definition falls under.
  # Examples include dialectal
  type = models.CharField(max_length = 3, null=True)
  
  # The placement of this sense among all of the senses that refer to this sense's referent.
  order = models.SmallIntegerField(null=False)

  # The category (sports, science, ...) that this sense is related to.
  category = models.CharField(max_length = 6, null=True) # longest is six, tie including '고유명 일반'
  
  # Part of speech
  pos = models.CharField(max_length = 6, null=True)
  
  # JSON field for optional additional data.
  # Seven possible contained fields below
  additional_info = models.JSONField(null = True, default = None)
  # patterns, relations, examples, norms, grammar, proverb, region

class HanjaCharacter(models.Model):
  # This character. 金, 韓, 朴, 安 are examples of what might be in this field.
  character = models.CharField(primary_key = True, max_length = 1)

  # 이 한자의 훈음. The meaning(s) and reading(s) associated with this character. 
  meaning_reading = models.CharField(null=False)

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

  # 있었지만 지금 사용 안 됩니다.
  explanation = models.CharField(null=True)

  def __str__(self):
    return self.character