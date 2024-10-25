import re
from django.db.models import Case, When, Value, BooleanField, Count, QuerySet, Q, OuterRef, Exists
from django.db.models.functions import Length, StrIndex

from shared.string_utils import is_hanja
from words.models import HanjaMeaningReading, KoreanWord
from users.models import User

def get_korean_search_queryset_with_search_params(query_params):
  search_term = query_params['search_term']
  search_type = query_params.get('search_type', 'word_exact')
  
  queryset = KoreanWord.objects.all()

  if search_type == 'word_exact':
    for character in search_term:
      # If the word contains any hanja then it will instead check the origin field
      # So searching '單語' will return the word '단어'
      if is_hanja(character):
        return queryset.filter(origin__exact = search_term)
    
    queryset = KoreanWord.objects.filter(word__exact = search_term)
  elif search_type == 'word_regex':
    regized_search_term = '^' + search_term + '$'
    
    try: 
      re.compile(regized_search_term)
    except re.error:
      regized_search_term = re.escape(regized_search_term)

    for character in search_term:
      # If the word contains any hanja then it will instead check the origin field
      # So searching '.語' will return (among others) the word '단어'
      if is_hanja(character):
        return queryset.filter(origin__iregex = regized_search_term)

    return queryset.filter(word__iregex = regized_search_term)
  elif search_type == 'definition_contains':
    return queryset.all() \
                   .prefetch_related('senses') \
                   .filter(senses__definition__contains = search_term)

  # default
  return queryset

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

def get_relop_prefix(str):
  relops = ['eq', 'gte', 'gt', 'lte', 'lt', 'not']
  
  for relop in relops:
    if str.startswith(relop):
      return relop, str[len(relop):]
  
  return '', str

def get_exam_rank_num(exam_rank):
  exam_rank_num = -1

  try:
    exam_rank_num = 2 * int(exam_rank[-2])
  except ValueError:
    pass
  if exam_rank.startswith('준'):
    exam_rank_num += 1
  if '특' in exam_rank:
    exam_rank_num += 1
  
  return exam_rank_num

def filter_hanja_search_with_search_params(initial_queryset, query_params):
  decomposition_filter = query_params.get('decomposition', None)
  radical_filter = query_params.get('radical', None)
  stroke_filter = query_params.get('strokes', None)
  grade_level_filter = query_params.get('grade_level', None)
  exam_level_filter = query_params.get('exam_level', None)

  queryset = initial_queryset

  if decomposition_filter:
    queryset = queryset.filter(decomposition__contains = decomposition_filter)
  if radical_filter:
    queryset = queryset.filter(radical = radical_filter)
  if stroke_filter:
    relop, stroke_count = get_relop_prefix(stroke_filter)
    if relop == 'gt':
      queryset = queryset.filter(strokes__gt = stroke_count)
    elif relop == 'gte':
      queryset = queryset.filter(strokes__gte = stroke_count)
    elif relop == 'lt':
      queryset = queryset.filter(strokes__lt = stroke_count)
    elif relop == 'lte':
      queryset = queryset.filter(strokes__lte = stroke_count)
    elif relop == 'eq':
      queryset = queryset.filter(strokes = stroke_count)
    elif relop == 'not':
      queryset = queryset.exclude(strokes = stroke_count)
  if grade_level_filter:
    queryset = queryset.filter(grade_level = grade_level_filter)
  if exam_level_filter:
    relop, exam_level = get_relop_prefix(exam_level_filter)
    as_result_ranking = get_exam_rank_num(exam_level)
    if relop == 'gt':
      queryset = queryset.filter(result_ranking__gt = as_result_ranking)
    elif relop == 'gte':
      queryset = queryset.filter(result_ranking__gte = as_result_ranking)
    elif relop == 'lt':
      queryset = queryset.filter(result_ranking__lt = as_result_ranking)
    elif relop == 'lte':
      queryset = queryset.filter(result_ranking__lte = as_result_ranking)
    elif relop == 'eq':
      queryset = queryset.filter(result_ranking = as_result_ranking)
    elif relop == 'not':
      queryset = queryset.exclude(result_ranking = as_result_ranking)
  
  return queryset

def get_ordered_hanja_search_results_type_hanja_search(initial_queryset, search_term, fallback_order):
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
  queryset = queryset.filter(has_any_char)

  # Orders the queryset according to where the characters actually are in search_term.
  # Prevents the order of the queryset for search_term '頭痛' from being the second
  # character, then the first.
  queryset = queryset.annotate(
    order = StrIndex(Value(search_term), "character")
  )
  order_by_fields = ["order"] + fallback_order
  return queryset.order_by(*order_by_fields)

def get_ordered_hanja_search_results_type_korean_search(initial_queryset, search_term, fallback_order):

  # if length is 1, move results where this is the reading (always exactly 1 character) instead
  # of the meaning (1+ characters) to the front of the queryset; almost 
  # all of the time this is what users would intend when inputting a single korean 
  # character

  # after this, characters with the search term as a substring as part of a meaning of theirs 
  # should come next
  # then characters with the search term as a substring of their explanation should come next
  # then fallback order

  has_reading_subquery = HanjaMeaningReading.objects.filter(
    referent=OuterRef('pk'),
    readings__icontains=search_term
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
    referent=OuterRef('pk'),
    meaning__icontains=search_term
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
      When(explanation__icontains = search_term, then = Value(True)),
      default = Value(False),
      output_field = BooleanField()
    ) if len(search_term) > 1 else Value(False)
  )

  queryset = initial_queryset.annotate(
    is_in_reading = is_in_reading,
    is_in_meaning = is_in_meaning,
    is_in_explanation = is_in_explanation
  ).filter(
    # words that satisfy none of the three need to be excluded
    Q(is_in_reading = True) |
    Q(is_in_meaning = True) |
    Q(is_in_explanation = True)
  )

  order_by_fields = ["-is_in_reading", "-is_in_meaning", "-is_in_explanation"] + fallback_order
  return queryset.order_by(*order_by_fields)

def get_ordered_hanja_search_results(initial_queryset, search_term):
  
  fallback_fields = ["-result_ranking", "strokes", "character"]

  # Search with hanja.
  for character in search_term:
    if is_hanja(character):
      return get_ordered_hanja_search_results_type_hanja_search(initial_queryset, search_term, fallback_fields)
    
  # Search hangul only.
  return get_ordered_hanja_search_results_type_korean_search(initial_queryset, search_term, fallback_fields)
