from django.contrib import admin
from words.models import HanjaCharacter

@admin.register(HanjaCharacter)
class HanjaCharacterAdmin(admin.ModelAdmin):
  search_fields = ['character']