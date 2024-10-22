from django.db import models
from django.contrib.auth.models import AbstractUser

from words.models import KoreanWord, HanjaCharacter

import os
import uuid

class User(AbstractUser):
  known_words = models.ManyToManyField(to=KoreanWord, related_name='users_that_know')
  known_hanja = models.ManyToManyField(to=HanjaCharacter, related_name='users_that_know')

  studied_words = models.ManyToManyField(to=KoreanWord, related_name='users_that_study')
  studied_hanja = models.ManyToManyField(to=HanjaCharacter, related_name='users_that_study')

def get_image_path(instance, filename):
  # example path may be MEDIAROOT/userid_1/myimage.png
  _, ext = os.path.splitext(filename)
  new_filename = uuid.uuid4().hex + ext
  return f'user{instance.creator_id}/{new_filename}'

class UserImage(models.Model):
  id = models.BigAutoField(primary_key=True)
  creator = models.ForeignKey(User, on_delete=models.CASCADE, 
                              related_name='created_notes', null=False)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE, 
                               related_name="user_notes", null=False)
  
  order = models.SmallIntegerField(null = False)
  
  # image is required.
  note_text = models.CharField(max_length = 100, null=True)
  note_image = models.ImageField(upload_to=get_image_path, null=False)

class UserExampleSentence(models.Model):
  id = models.BigAutoField(primary_key=True)
  creator = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name='created_examples', null=False)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE, 
                               related_name="user_sentences", null=False)
  
  order = models.SmallIntegerField(null = False)
  
  sentence = models.CharField(max_length=1000, null=False)
  source = models.CharField(max_length=1000, null=True)