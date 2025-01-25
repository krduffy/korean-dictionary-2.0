from django.contrib import admin
from hanja.models import HanjaCharacter, HanjaMeaningReading


class MeaningReadingInline(admin.TabularInline):
    model = HanjaMeaningReading
    extra = 0


@admin.register(HanjaCharacter)
class HanjaCharacterAdmin(admin.ModelAdmin):
    search_fields = ["character"]
    inlines = [MeaningReadingInline]
