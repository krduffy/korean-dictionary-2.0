from django.contrib import admin
from django.core.exceptions import PermissionDenied
from user_examples.models import (
    UserImage,
    UserExampleSentence,
    UserVideoExample,
    DerivedExampleText,
    DerivedExampleLemma,
)


class ReadOnlyAdmin(admin.ModelAdmin):
    readonly_fields = [field.name for field in UserImage._meta.get_fields()]
    list_display = ("id",)
    search_fields = ("id",)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        raise PermissionDenied("This model is read-only in the admin interface.")

    def delete_model(self, request, obj):
        raise PermissionDenied("This model is read-only in the admin interface.")


@admin.register(UserImage)
class UserImageAdmin(ReadOnlyAdmin):
    readonly_fields = [field.name for field in UserImage._meta.get_fields()]
    list_display = ("id", "user_ref", "word_ref", "source")


@admin.register(UserExampleSentence)
class UserExampleSentenceAdmin(ReadOnlyAdmin):
    readonly_fields = [field.name for field in UserExampleSentence._meta.get_fields()]
    list_display = ("id", "user_ref", "word_ref", "sentence", "source")


@admin.register(UserVideoExample)
class UserVideoExampleAdmin(ReadOnlyAdmin):
    readonly_fields = [field.name for field in UserVideoExample._meta.get_fields()]
    list_display = ("id", "user_ref", "word_ref", "video_id", "start", "end", "source")


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
