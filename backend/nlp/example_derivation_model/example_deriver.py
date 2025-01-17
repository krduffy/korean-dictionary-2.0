from django.core.files.uploadedfile import InMemoryUploadedFile

from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
)
from nlp.example_derivation_model.headword_disambiguator import HeadwordDisambiguator
from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.get_headwords_for_lemma import get_headwords_for_lemma
from nlp.example_derivation_model.banned_lemmas import banned_lemmas


class ExampleDeriver:

    def __init__(self):
        self.lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
        self.headword_disambiguator = HeadwordDisambiguator()
        self.banned_lemmas = banned_lemmas

    def derive_examples_from_text(self, text: str):
        len(text)
        self._add_examples_in_text(text)

    def derive_examples_from_file(self, in_memory_file: InMemoryUploadedFile):
        in_memory_file.open(mode="rb")

        for i, bytes in enumerate(in_memory_file.chunks()):
            text = bytes.decode("utf-8")
            # print(f"text {i} is {text}")
            # print("here are lemmas")
            self._add_examples_in_text(text)

    def _add_examples_in_text(self, text):
        all_lemmas = self.lemmatizer.get_lemmas(text)

        c = 0

        for index, lemma_list_at_index in enumerate(all_lemmas):
            for lemma in lemma_list_at_index:

                assumed_headword = self._pick_headword_target_code(text, index, lemma)

                # print(
                #     f"i think the tc for '{lemma}' is "
                #     f"{self._pick_headword_target_code(text, index, lemma)}"
                # )

    def _pick_headword_target_code(self, text: str, index, lemma):
        # If on banlist then any further disambiguation is a waste of time
        if lemma in banned_lemmas:
            return LEMMA_IGNORED

        # get headwords. get_headwords_for_lemma cuts out many of the
        # headwords if they have no sense with enough examples
        headwords_for_lemma, has_any_headword = get_headwords_for_lemma(lemma)

        # No headword at all (including ones cut out because they didn't have
        # enough examples)
        if not has_any_headword:
            return NO_KNOWN_HEADWORDS

        # Only one headword common enough to have any examples. Skip kobert
        # embeddings entirely
        if len(headwords_for_lemma) == 1:
            return headwords_for_lemma[0]["target_code"]

        # Lemma has some headwords but none have enough examples, so it's
        # unlikely that anything valuable can be gotten from running model
        # Just return ambiguous result and let it be a lemma-bound example
        # instead of a headword-bound example
        elif len(headwords_for_lemma) == 0:
            return LEMMA_AMBIGUOUS

        # >= 2 pertinent headwords; actual disambiguation is required

        print(f"lemma {lemma} is ambiguous")

        return self.headword_disambiguator.pick_headword_from_choices(
            text, index, headwords_for_lemma
        )
