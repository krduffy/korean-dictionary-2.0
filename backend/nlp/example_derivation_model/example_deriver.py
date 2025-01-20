from typing import List, Tuple
from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
    LEMMA_ALREADY_DISAMBIGUATED,
)
from nlp.example_derivation_model.headword_disambiguator import HeadwordDisambiguator
from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.get_headwords_for_lemma import get_headwords_for_lemma
from nlp.models import SkippedLemma
from nlp.example_derivation_model.configuration import SUBTEXT_TARGET_CHARACTER_LENGTH

from time import perf_counter


class ExampleDeriver:

    def __init__(self):
        self.lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
        self.headword_disambiguator = HeadwordDisambiguator()
        self.already_disambiguated_set = set()

    def _get_split_texts(self, text: str) -> List[str]:
        """Splits a text into a number of smaller strings to be input into
        the model. Done to limit the amount of tokens that need to be
        tokenized"""
        paragraphs = text.split("\n")

        current_text = ""
        current_length = 0

        texts = []

        for paragraph in paragraphs:
            paragraph_length = len(paragraph)

            if paragraph_length + current_length > SUBTEXT_TARGET_CHARACTER_LENGTH:
                texts.append(current_text)

                current_text = paragraph
                current_length = paragraph_length
            elif current_length > 0:
                current_text += "\n" + paragraph
                current_length += paragraph_length
            else:
                current_text = paragraph
                current_length = paragraph_length

        if current_text:
            texts.append(current_text)

        return texts

    def generate_examples_in_text(self, text):

        input_texts = self._get_split_texts(text)
        print(input_texts)

        # running number regardless of split input texts' boundaries
        eojeol_num = 0

        for input_text in input_texts:

            all_lemmas = self.lemmatizer.get_lemmas(input_text)

            for index, lemma_list_at_index in enumerate(all_lemmas):
                for lemma in lemma_list_at_index:

                    skip_lookup_time, time_in_disambiguator, assumed_headword = (
                        self._pick_headword_target_code(input_text, index, lemma)
                    )

                    yield {
                        "lemma": lemma,
                        "headword_pk": assumed_headword,
                        "eojeol_num": eojeol_num,
                        "time_in_disambiguator": time_in_disambiguator,
                        "skip_lookup_time": skip_lookup_time,
                    }

                    eojeol_num += 1

    def _pick_headword_target_code(
        self, text: str, index, lemma
    ) -> Tuple[float, float, int]:
        """Returns a tuple containing time spent doing skip lookup,
        time spent in pick_headword_from_choices,
        and the predicted headword's pk"""

        if lemma in self.already_disambiguated_set:
            return (0, 0, LEMMA_ALREADY_DISAMBIGUATED)

        skip_this_lemma = False
        before_skipped_lookup, skip_lookup_time = 0, 0

        try:
            before_skipped_lookup = perf_counter()
            SkippedLemma.objects.get(pk=lemma)
            skip_this_lemma = True
        except SkippedLemma.DoesNotExist:
            pass
        finally:
            skip_lookup_time = perf_counter() - before_skipped_lookup

        # If on banlist then any further disambiguation is a waste of time
        if skip_this_lemma:
            return (skip_lookup_time, 0, LEMMA_IGNORED)

        # get headwords. get_headwords_for_lemma cuts out many of the
        # headwords if they have no sense with enough examples
        headwords_for_lemma, has_any_headword = get_headwords_for_lemma(lemma)

        # No headword at all (including ones cut out because they didn't have
        # enough examples)
        if not has_any_headword:
            return (skip_lookup_time, 0, NO_KNOWN_HEADWORDS)

        # Only one headword common enough to have any examples. Skip kobert
        # embeddings entirely
        if len(headwords_for_lemma) == 1:
            return (skip_lookup_time, 0, headwords_for_lemma[0]["target_code"])

        # Lemma has some headwords but none have enough examples, so it's
        # unlikely that anything valuable can be gotten from running model
        # Just return ambiguous result and let it be a lemma-bound example
        # instead of a headword-bound example
        if len(headwords_for_lemma) == 0:
            return (skip_lookup_time, 0, LEMMA_AMBIGUOUS)

        # >= 2 pertinent headwords; actual disambiguation is required

        time_before = perf_counter()

        pk = self.headword_disambiguator.pick_headword_from_choices(
            text, index, headwords_for_lemma
        )

        # a legitimate pk returned
        if pk >= 0:
            self.already_disambiguated_set.add(lemma)

        total_time_in_disambiguator = perf_counter() - time_before

        return (skip_lookup_time, total_time_in_disambiguator, pk)
