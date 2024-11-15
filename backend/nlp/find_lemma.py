import copy
import re
from nlp.korean_lang_utils import 교착
from words.models import KoreanWord

DUMMY_STRING = "kieran"
DUMMY_NUM_WORDS = ["zero", "one", "two", "three", "four", "five"]


# Returns the nouns and verbs in a sentence, as analyzed by Kkma (from the konlpy library).
def get_nouns_verbs(sentence, kkma_instance):
    """
    A function to get nouns and verb lemmas from a given sentence.

    Parameters:
      - `sentence`: The sentence from which to extract nouns and verbs

    Returns: A tuple containing:
      - The list of nouns and verbs in the first position.
      - The list of all lemmas in the sentence in the second position.
    """

    def accept_pos(str):
        return (
            str.startswith("N")
            or str.startswith("V")
            or str.startswith("M")
            or str == "XR"
            or str == "XSA"
            or str == "OL"
        )

    def is_어근_followed_by_deriv_suffix(str1, str2):
        return (str1 == "XR" or str1 == "NNG") and str2 == "XSA"

    original_analysis = kkma_instance.pos(sentence)

    accepted_lemmas = [item for item in original_analysis if accept_pos(item[1])]
    num_accepted_lemmas = len(accepted_lemmas)
    filtered_analysis = []

    for i in range(0, num_accepted_lemmas):

        if i != (num_accepted_lemmas - 1) and is_어근_followed_by_deriv_suffix(
            accepted_lemmas[i][1], accepted_lemmas[i + 1][1]
        ):

            filtered_analysis.append(
                (accepted_lemmas[i][0] + accepted_lemmas[i + 1][0], "V")
            )

        elif not accepted_lemmas[i][1] == "XSA":
            filtered_analysis.append(accepted_lemmas[i])

    return (filtered_analysis, original_analysis)


# this is called to ensure that if something like 공자(孔子) the analysis will return
# 孔子 instead of 공자 in general. Because there are so many 동음이의어 in korean, this
# is more convenient for the user so that they do not have to scroll through results
# to get to the correct one if the string itself specifies a hanja origin.
def get_hanja_if_in_original(found_word, original_string):
    # 1 or more hanja characters surrounded by parentheses
    regex = r"\([\u4e00-\u9fff]+\)"

    pattern = re.compile(regex)

    match = pattern.search(original_string)
    if match:
        # start from 1, end at -1 to remove parentheses
        hanja_word = match.group()[1:-1]
        if (
            KoreanWord.objects.filter(word__exact=found_word)
            .filter(origin__exact=hanja_word)
            .exists()
        ):
            return hanja_word

    return None


def process_sentence(original_sentence, original_inner_strings):
    delimiting_pairs = [("‘", "’")]
    # checks for strings with no whitespace and both of the things in a delimiting pair
    regex = "|".join(
        f"(?:{re.escape(start)}" + r"[^\s]" + f"+?{re.escape(end)})"
        for start, end in delimiting_pairs
    )
    pattern = re.compile(regex)

    # No processing to be done.
    if not pattern.match(original_sentence):
        return (original_sentence, original_inner_strings)

    new_sentence_strings = copy.deepcopy(original_inner_strings)
    # this dummy string will get tagged as OL (other language).
    # thus, I check if a thing to be returned starts with this string
    # if it does, we will instead return the original string.
    # This is necessary because the model cannot handle things like
    # '\'살다\'의 피동사' well due to the apostrophes. However, these kinds of
    # definitions are so common that it is beneficial to have this additional
    # line of defense against returning no string
    num_dummies = 0

    for i in range(0, len(original_inner_strings)):
        found = pattern.match(original_inner_strings[i])
        if found:
            original_inner_strings[i] = found.group()[1:-1]
            new_sentence_strings[i] = new_sentence_strings[i].replace(
                found.group(), DUMMY_STRING + DUMMY_NUM_WORDS[num_dummies]
            )
            num_dummies += 1

    new_sentence = "".join(string for string in new_sentence_strings)

    return (new_sentence, new_sentence_strings)


def get_from_index_heuristic(
    sentence, mouse_over, filtered_analysis, original_inner_strings
):
    # this is a heuristic but it is correct almost every time from testing
    # with sentence strings that contain hanja, very long sentences, several 조사 all
    # glued together, etc. If I find that it is unsatisfyingly inaccurate then I will make
    # changes but this feature of clicking on words will need to be toggled anyway ( there will
    # be a disclaimer about potential inaccuracies) so this is what I will be using for the time
    # being.
    if len(filtered_analysis) == len(sentence.split()):
        index_of_mouse_over = sentence.split().index(mouse_over)

        # Getting the return word and its type (to know if 다) needs to be added
        return_word = filtered_analysis[index_of_mouse_over][0]
        word_type = filtered_analysis[index_of_mouse_over][1]

        # If the returned word starts with the dummy string,
        # need to get rid of dummy string which will leave just "one" or "three"
        # or whatever number word has appended to the dummy string
        if return_word.startswith(DUMMY_STRING):
            return_word = original_inner_strings[
                DUMMY_NUM_WORDS.index(return_word.replace(DUMMY_STRING, ""))
            ]

        hanja = get_hanja_if_in_original(return_word, mouse_over)

        if hanja:
            return hanja
        else:
            return return_word + "다" if word_type.startswith("V") else return_word

    return None


def get_from_prefix_heuristic(mouse_over, filtered_analysis):
    for word in filtered_analysis:
        if mouse_over.startswith(word):
            hanja = get_hanja_if_in_original(word[0], mouse_over)

            if hanja:
                return hanja
            else:
                returned_word = word[0] + "다" if word[1].startswith("V") else word[0]
                return returned_word

    return None


def get_verbs_and_어미(analysis):
    appending = False
    returned_verbs = []

    for item in analysis:
        item_morpheme = item[0]
        item_tag = item[1]

        if not appending and item_tag.startswith("V"):
            returned_verbs.append((item_morpheme, []))
            appending = True
        # VX is 보조동사, E는 어미
        elif appending and (item_tag.startswith("VX") or item_tag.startswith("E")):
            returned_verbs[-1][1].append(item_morpheme)
        else:
            appending = False

    return returned_verbs


def get_from_agglutinated_reconstruction(mouse_over, original_analysis):
    verbs_and_어미 = get_verbs_and_어미(original_analysis)
    for verb, 어미들 in verbs_and_어미:
        교착된_활용어들 = 교착(verb, 어미들)
        if mouse_over in 교착된_활용어들:
            return verb + "다"

    return None


def find_lemma(sentence, mouse_over, kkma_instance):
    original_inner_strings = sentence.split()
    (new_sentence, new_inner_strings) = process_sentence(
        sentence, original_inner_strings
    )

    filtered_analysis, original_analysis = get_nouns_verbs(new_sentence, kkma_instance)

    # this is a heuristic but it is correct almost every time from testing
    # with sentence strings that contain hanja, very long sentences, several 조사 all
    # glued together, etc. If I find that it is unsatisfyingly inaccurate then I will make
    # changes but this feature of clicking on words will need to be toggled anyway ( there will
    # be a disclaimer about potential inaccuracies) so this is what I will be using for the time
    # being.
    from_index_heuristic = get_from_index_heuristic(
        sentence, mouse_over, filtered_analysis, original_inner_strings
    )
    if from_index_heuristic:
        return from_index_heuristic

    # Prefix heuristic checks if the mouse over term is a prefix of any of the words in the
    # analysis. This can be correct for some verbs. However, verbs are often not found here
    # because they never contain '다' in the verb itself. However, there is another problem
    # with changes such as 보다 -> 봤어요 where even if it only checks that 봤어요 starts with
    # 보, it will not be found because things ending in ㅜ, ㅗ, ㅡ, ㅣ, etc often change to
    # ㅝ, ㅘ, ㅓ, ㅕ. Additionally the ㅆ as 받침 makes finding verbs difficult here.
    # TODO can also look for the longest string that matches so 원자량 matches 원자량 instead of 원자 etc
    from_prefix_heuristic = get_from_prefix_heuristic(mouse_over, filtered_analysis)
    if from_prefix_heuristic:
        return from_prefix_heuristic

    # Last resort.
    # Falls back to the original analysis and tries to reconstruct the verbs and the 어미
    # from the original analysis.
    # If mouse over matches any of them, the dictionary 용언 without morphological changes
    # from any 어미 is returned.
    from_agglutinated_reconstruction = get_from_agglutinated_reconstruction(
        mouse_over, original_analysis
    )
    if from_agglutinated_reconstruction:
        return from_agglutinated_reconstruction

    return None
