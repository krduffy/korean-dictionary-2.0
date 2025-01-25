import re
from django.db.models import (
    QuerySet,
)
from shared.search_result_annotations import annotate_with_length
from shared.string_utils import is_hanja
from korean.models import KoreanHeadword


def get_korean_search_queryset_with_search_params(query_params):
    search_term = query_params["search_term"]
    search_type = query_params.get("search_type", "word_exact")

    queryset = KoreanHeadword.objects

    if search_type == "word_exact":
        for character in search_term:
            # If the word contains any hanja then it will instead check the origin field
            # So searching '單語' will return the word '단어'
            if is_hanja(character):
                return queryset.filter(origin__exact=search_term)

        queryset = queryset.filter(word__exact=search_term)
    elif search_type == "word_regex":
        regized_search_term = "^" + search_term + "$"

        try:
            re.compile(regized_search_term)
        except re.error:
            regized_search_term = re.escape(regized_search_term)

        for character in search_term:
            # If the word contains any hanja then it will instead check the origin field
            # So searching '.語' will return (among others) the word '단어'
            if is_hanja(character):
                return queryset.filter(origin__iregex=regized_search_term)

        return queryset.filter(word__iregex=regized_search_term)
    elif search_type == "definition_contains":
        return queryset.prefetch_related("senses", "senses__definition").filter(
            senses__definition__contains=search_term
        )

    # default
    return queryset


def get_ordered_korean_search_results(initial_queryset: QuerySet) -> QuerySet:
    """
    Reorders a queryset of KoreanHeadwords for listing in search results.
    The ordering is as follows:
    1. The words are ordered by their `result_ranking`s.
    2. If multiple words have the same result_rankings, shorter words are prioritized.
    3. For words of the same length, they are ordered in 가나다순 (alphabetical order).
    4. As a final tiebreaker, words are sorted by their primary key.

    Parameters:
      `queryset`: The queryset of words to reorder.

    Returns: The reordered queryset.
    """

    new_queryset = annotate_with_length(initial_queryset).order_by(
        "-result_ranking",  # Result ranking first
        "length",  # Shorter words first
        "word",  # 가나다순 (alphabetical order)
        "pk",  # Tiebreaker by primary key
    )

    return new_queryset
