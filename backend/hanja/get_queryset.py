from django.db.models import (
    Case,
    When,
    Value,
    BooleanField,
    Q,
    OuterRef,
    Exists,
)
from django.db.models.functions import StrIndex

from shared.search_result_annotations import (
    annotate_with_length,
    annotate_with_studied,
    annotate_with_known,
    annotate_with_users_that_know,
)
from shared.string_utils import is_hanja
from hanja.models import HanjaCharacter, HanjaMeaningReading


def get_korean_search_queryset_with_search_params(query_params):

    queryset = HanjaCharacter.objects.prefetch_related("meaning_readings")
    queryset = filter_hanja_search_with_search_params(queryset, query_params)

    return get_ordered_hanja_search_results(queryset, query_params["search_term"])


def filter_hanja_search_with_search_params(initial_queryset, query_params):
    decomposition_filter = query_params.get("decomposition")
    radical_filter = query_params.get("radical")
    stroke_filter = query_params.get("strokes")
    grade_level_filter = query_params.get("grade_level")
    result_ranking_filter = query_params.get("result_ranking")

    queryset = initial_queryset

    if decomposition_filter:
        queryset = queryset.filter(decomposition__contains=decomposition_filter)
    if radical_filter:
        queryset = queryset.filter(radical=radical_filter)
    if stroke_filter:
        relop, stroke_count = stroke_filter.relop, stroke_filter.value
        if relop == "gt":
            queryset = queryset.filter(strokes__gt=stroke_count)
        elif relop == "gte":
            queryset = queryset.filter(strokes__gte=stroke_count)
        elif relop == "lt":
            queryset = queryset.filter(strokes__lt=stroke_count)
        elif relop == "lte":
            queryset = queryset.filter(strokes__lte=stroke_count)
        elif relop == "eq":
            queryset = queryset.filter(strokes=stroke_count)
        elif relop == "not":
            queryset = queryset.exclude(strokes=stroke_count)
    if grade_level_filter:
        queryset = queryset.filter(grade_level=grade_level_filter)
    if result_ranking_filter:
        relop, result_ranking = result_ranking_filter.relop, result_ranking_filter.value
        if relop == "gt":
            queryset = queryset.filter(result_ranking__gt=result_ranking)
        elif relop == "gte":
            queryset = queryset.filter(result_ranking__gte=result_ranking)
        elif relop == "lt":
            queryset = queryset.filter(result_ranking__lt=result_ranking)
        elif relop == "lte":
            queryset = queryset.filter(result_ranking__lte=result_ranking)
        elif relop == "eq":
            queryset = queryset.filter(result_ranking=result_ranking)
        elif relop == "not":
            queryset = queryset.exclude(result_ranking=result_ranking)

    return queryset


def get_ordered_hanja_search_results_type_hanja_search(
    initial_queryset, search_term, fallback_order
):
    # Filters out any characters that are not in search_term.
    # Note that it should be len(search_term) > 1 because if it is 1 then the app
    # should instead issue a get request to get the detailed page for the char. This is to
    # make searches where the user clearly wants data for a single character
    # automatically render a more detailed view and eliminate the extra click
    # otherwise required. A query with search_term '頭痛' will filter out every
    # character except for those 2.
    individual_char_queries = [Q(character__icontains=char) for char in search_term]
    has_any_char = individual_char_queries[0]
    for query in individual_char_queries:
        has_any_char = has_any_char | query
    queryset = initial_queryset.filter(has_any_char)

    # Orders the queryset according to where the characters actually are in search_term.
    # Prevents the order of the queryset for search_term '頭痛' from being the second
    # character, then the first.
    queryset = queryset.annotate(order=StrIndex(Value(search_term), "character"))
    order_by_fields = ["order"] + fallback_order
    return queryset.order_by(*order_by_fields)


def get_ordered_hanja_search_results_type_korean_search(
    initial_queryset, search_term, fallback_order
):

    # if length is 1, move results where this is the reading (always exactly 1 character) instead
    # of the meaning (1+ characters) to the front of the queryset; almost
    # all of the time this is what users would intend when inputting a single korean
    # character

    # after this, characters with the search term as a substring as part of a meaning of theirs
    # should come next
    # then characters with the search term as a substring of their explanation should come next
    # then fallback order

    has_reading_subquery = HanjaMeaningReading.objects.filter(
        referent=OuterRef("pk"), readings__icontains=search_term
    )
    is_in_reading = (
        Case(
            When(Exists(has_reading_subquery), then=Value(True)),
            default=Value(False),
            output_field=BooleanField(),
        )
        if len(search_term) == 1
        else Value(False, output_field=BooleanField())
    )

    has_meaning_subquery = HanjaMeaningReading.objects.filter(
        referent=OuterRef("pk"), meaning__icontains=search_term
    )
    is_in_meaning = Case(
        When(Exists(has_meaning_subquery), then=Value(True)),
        default=Value(False),
        output_field=BooleanField(),
    )

    # if search is not at least length 2 a word is never in the explanation.
    # otherwise, searching '다' would return pretty much every single character due to
    # words like 한다 and 이다 being in most explanations
    is_in_explanation = (
        Case(
            When(explanation__icontains=search_term, then=Value(True)),
            default=Value(False),
            output_field=BooleanField(),
        )
        if len(search_term) > 1
        else Value(False)
    )

    queryset = initial_queryset.annotate(
        is_in_reading=is_in_reading,
        is_in_meaning=is_in_meaning,
        is_in_explanation=is_in_explanation,
    ).filter(
        # words that satisfy none of the three need to be excluded
        Q(is_in_reading=True)
        | Q(is_in_meaning=True)
        | Q(is_in_explanation=True)
    )

    order_by_fields = [
        "-is_in_reading",
        "-result_ranking",
        "-is_in_meaning",
        "-is_in_explanation",
    ] + fallback_order
    return queryset.order_by(*order_by_fields)


def get_ordered_hanja_search_results(initial_queryset, search_term):

    fallback_fields = ["strokes", "character"]

    # Search with hanja.
    for character in search_term:
        if is_hanja(character):
            return get_ordered_hanja_search_results_type_hanja_search(
                initial_queryset, search_term, fallback_fields
            )

    # Search hangul only.
    return get_ordered_hanja_search_results_type_korean_search(
        initial_queryset, search_term, fallback_fields
    )


def get_ordered_hanja_example_queryset(initial_queryset, user):

    annotated_queryset = annotate_with_studied(
        annotate_with_known(
            annotate_with_users_that_know(annotate_with_length(initial_queryset)), user
        ),
        user,
    )

    new_queryset = annotated_queryset.order_by(
        "-result_ranking",  # Result ranking first
        "-studied",  # Words that the user is studying second
        "-known",  # Then by words that the user knows
        "-users_that_know_count",  # Then by the number of users who know the word
        "length",  # Shorter words first
        "word",  # 가나다순 (alphabetical order)
        "pk",  # Tiebreaker by primary key
    )

    return new_queryset
