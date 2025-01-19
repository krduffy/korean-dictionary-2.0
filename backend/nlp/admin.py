from django.contrib import admin
from nlp.models import DerivedExampleLemma, DerivedExampleText, SkippedLemma


@admin.register(SkippedLemma)
class SkippedLemmaAdmin(admin.ModelAdmin):

    readonly_fields = ["lemma"]

    def has_view_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request):
        return True

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class LemmaInline(admin.TabularInline):
    model = DerivedExampleLemma
    extra = 0
    readonly_fields = ("lemma", "word_ref", "eojeol_number_in_source_text")


@admin.register(DerivedExampleText)
class DerivedExampleTextAdmin(admin.ModelAdmin):
    inlines = [LemmaInline]

    def has_view_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request):
        return True

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
