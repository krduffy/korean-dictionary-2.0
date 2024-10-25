
from shared.api_utils import get_bad_request

def get_korean_search_param_error(query_params, user):
  if not query_params.get('search_term', None):
    return get_bad_request("A search term is required.")
  
  search_type = query_params.get('search_type', 'word_exact')
  valid_search_types = ["word_exact", "word_regex", "definition_contains"]
  if search_type not in valid_search_types:
    return get_bad_request("Search type provided is unsupported.")
  if search_type == 'word_regex' and not user.is_staff:
    return get_bad_request("Search type provided is unsupported.")

def get_relop_prefix(str):
  relops = ['eq', 'gte', 'gt', 'lte', 'lt', 'not']
  
  for relop in relops:
    if str.startswith(relop):
      return relop, str[len(relop):]
  
  return '', str

def get_hanja_search_param_error(query_params):
  search_term = query_params.get('search_term', '')
  if not search_term:
    return get_bad_request("A search term is required.")
  
  # filter parameters:
  # "decomposition", "radical", "strokes", "grade_level", "exam_level"
  
  decomposition_filter = query_params.get('decomposition', None)
  if decomposition_filter:
    if len(decomposition_filter) > 1:
      return get_bad_request("Decomposition query parameter cannot exceed length 1.")
  
  radical_filter = query_params.get('radical', None)
  if radical_filter:
    if len(radical_filter) > 1:
      return get_bad_request("Radical query parameter cannot exceed length 1.")

  stroke_filter = query_params.get('strokes', None)
  if stroke_filter:
    prefix, remainder = get_relop_prefix(stroke_filter)
    
    allowed_prefixes = ['eq', 'gt', 'gte', 'lt', 'lte', 'not']
    if prefix not in allowed_prefixes:
      return get_bad_request("Stroke query parameter must start with any of " + 
                              ", ".join(pre for pre in allowed_prefixes))
    try:
      int(remainder)
    except ValueError:
      return get_bad_request("Stroke query parameter not suffixed with int-convertible " +
                              "number of strokes.")
  
  grade_level_filter = query_params.get('grade_level', None)
  if grade_level_filter:
    allowed_grade_levels = ['중학교', '고등학교', '미배정']
    if grade_level_filter not in allowed_grade_levels:
      return get_bad_request("Grade level query parameter must be any of " +
                              ", ".join(gl for gl in allowed_grade_levels))
  
  exam_level_filter = query_params.get('exam_level', None)
  if exam_level_filter:
    prefix, remainder = get_relop_prefix(stroke_filter)
    
    allowed_prefixes = ['eq', 'gt', 'gte', 'lt', 'lte', 'not']
    if prefix not in allowed_prefixes:
      return get_bad_request("Exam level query parameter must start with any of " + 
                              ", ".join(pre for pre in allowed_prefixes))
    allowed_exam_levels = [
      '8급',
      '준7급', '7급',
      '준6급', '6급',
      '준5급', '5급',
      '준4급', '4급',
      '준3급', '3급',
      '준2급', '2급',
      '준1급', '1급',
      '준특급', '특급',
      '미배정'
    ]
    if remainder not in allowed_exam_levels:
      return get_bad_request("Exam level query parameter not suffixed with valid exam level " +
                              "(" + "".join(el for el in allowed_exam_levels) + ")")
    
  return None

