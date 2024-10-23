from django.db.models import Case, When, Value, BooleanField, Count, QuerySet
from django.db.models.functions import Length

from users.models import User

def get_ordered_korean_search_results(initial_queryset: QuerySet, user: User | None) -> QuerySet:
  """
    Reorders a queryset of KoreanWords for listing in search results. 
    The ordering is as follows:
    1. All words that the user is currently studying are placed at the top of the list.
    2. Following that, words are ordered by the total number of users who know each word.
    3. If multiple words have the same number of users that know them, shorter words are prioritized.
    4. For words of the same length, they are ordered in 가나다순 (alphabetical order).
    5. As a final tiebreaker, words are sorted by their primary key.

    Parameters:
      `queryset`: The queryset of words to reorder.
      `user`: The user whose studied words will affect the ordering. 
                                If None, no specific user filtering will be applied. 

    Returns: The reordered queryset.
  """
  
  studied_annotation = None
  if user is None or not user.is_authenticated:
    studied_annotation = Value(False)
  else:
    studied_annotation = Case(
      When(target_code__in=user.studied_words.all().filter(), then=Value(True)),
      default=Value(False),
      output_field=BooleanField(),
    )

  annotated_queryset = initial_queryset.annotate(
    studied=studied_annotation,
    users_that_know_count=Count("users_that_know"),
    length=Length("word"),
  )

  new_queryset = annotated_queryset.order_by(
    "-studied",               # Words that the user is studying first
    "-users_that_know_count", # Then by the number of users who know the word
    "length",                 # Shorter words first
    "word",                   # 가나다순 (alphabetical order)
    "pk"                      # Tiebreaker by primary key
  )

  return new_queryset
