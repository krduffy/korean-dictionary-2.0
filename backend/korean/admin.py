from django.contrib import admin
from korean.models import KoreanHeadword, Sense, SenseExample


@admin.register(SenseExample)
class SenseExampleAdmin(admin.ModelAdmin):
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


class SenseInline(admin.TabularInline):
    model = Sense
    extra = 0
    fields = ("target_code", "definition")


@admin.register(KoreanHeadword)
class KoreanHeadwordAdmin(admin.ModelAdmin):
    search_fields = ["word"]
    inlines = [SenseInline]

    # to override icontains and make it iexact instead
    # when searching on admin the results will be exact
    def get_search_results(self, request, queryset, search_term):

        queryset, use_distinct = super().get_search_results(
            request, queryset, search_term
        )

        if search_term:
            queryset = queryset.filter(word__iexact=search_term)

        return queryset, use_distinct


@admin.register(Sense)
class SenseAdmin(admin.ModelAdmin):
    search_fields = ["target_code"]
