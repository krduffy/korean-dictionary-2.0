from django.db.models import (
    Case,
    When,
    Value,
    BooleanField,
    Count,
)
from django.db.models.functions import Length


def annotate_with_studied(initial_queryset, user):

    studied_annotation = None
    if user is None or not user.is_authenticated:
        studied_annotation = Value(False)
    else:
        studied_annotation = Case(
            When(
                target_code__in=user.studied_headwords.all().filter(), then=Value(True)
            ),
            default=Value(False),
            output_field=BooleanField(),
        )

    return initial_queryset.annotate(studied=studied_annotation)


def annotate_with_known(initial_queryset, user):

    known_annotation = None
    if user is None or not user.is_authenticated:
        known_annotation = Value(False)
    else:
        known_annotation = Case(
            When(target_code__in=user.known_headwords.all().filter(), then=Value(True)),
            default=Value(False),
            output_field=BooleanField(),
        )

    return initial_queryset.annotate(known=known_annotation)


def annotate_with_users_that_know(initial_queryset):
    return initial_queryset.annotate(users_that_know_count=Count("users_that_know"))


def annotate_with_length(initial_queryset):
    return initial_queryset.annotate(length=Length("word"))
