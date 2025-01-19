from typing import Tuple
from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
)
from nlp.example_derivation_model.headword_disambiguator import HeadwordDisambiguator
from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.get_headwords_for_lemma import get_headwords_for_lemma
from nlp.example_derivation_model.banned_lemmas import banned_lemmas

from backend.settings import DEBUG
from time import perf_counter


class ExampleDeriver:

    def __init__(self):
        self.lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
        self.headword_disambiguator = HeadwordDisambiguator()
        self.banned_lemmas = banned_lemmas

    def generate_examples_in_text(self, text):
        all_lemmas = self.lemmatizer.get_lemmas(text)

        for index, lemma_list_at_index in enumerate(all_lemmas):
            for lemma in lemma_list_at_index:

                time_in_disambiguator, assumed_headword = (
                    self._pick_headword_target_code(text, index, lemma)
                )

                yield {
                    "lemma": lemma,
                    "headword_pk": assumed_headword,
                    "eojeol_num": index,
                    "time_in_disambiguator": time_in_disambiguator,
                }

    def _pick_headword_target_code(self, text: str, index, lemma) -> Tuple[float, int]:
        """Returns a tuple containing whether the model time spent in pick_headword_from_choices
        and the predicted headword's pk"""

        # If on banlist then any further disambiguation is a waste of time
        if lemma in banned_lemmas:
            return (0, LEMMA_IGNORED)

        # get headwords. get_headwords_for_lemma cuts out many of the
        # headwords if they have no sense with enough examples
        headwords_for_lemma, has_any_headword = get_headwords_for_lemma(lemma)

        # No headword at all (including ones cut out because they didn't have
        # enough examples)
        if not has_any_headword:
            return (0, NO_KNOWN_HEADWORDS)

        # Only one headword common enough to have any examples. Skip kobert
        # embeddings entirely
        if len(headwords_for_lemma) == 1:
            return (0, headwords_for_lemma[0]["target_code"])

        # Lemma has some headwords but none have enough examples, so it's
        # unlikely that anything valuable can be gotten from running model
        # Just return ambiguous result and let it be a lemma-bound example
        # instead of a headword-bound example
        if len(headwords_for_lemma) == 0:
            return (0, LEMMA_AMBIGUOUS)

        # >= 2 pertinent headwords; actual disambiguation is required

        time_before = perf_counter()

        pk = self.headword_disambiguator.pick_headword_from_choices(
            text, index, headwords_for_lemma
        )

        total_time_in_disambiguator = perf_counter() - time_before

        return (total_time_in_disambiguator, pk)
