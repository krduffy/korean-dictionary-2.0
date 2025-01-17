from django.core.files.uploadedfile import InMemoryUploadedFile

from nlp.example_derivation_model.embedder import Embedder
from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.get_headwords_for_lemma import get_headwords_for_lemma
from nlp.example_derivation_model.target_lemma_taggers import (
    tag_index_with_tgt,
)

# For the headword picker if it cannot decide
# which target_code is the correct lemma
UNSURE = -1


class ExampleDeriver:

    def __init__(self):
        self.lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
        self.embedder = Embedder()

    def derive_examples(self, in_memory_file: InMemoryUploadedFile):
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

                print(
                    f"i think the tc for '{lemma}' is "
                    f"{self._pick_headword_target_code(text, index, lemma)}"
                )

                c += 1
                if c > 5:
                    break
            if c > 5:
                break

    def _pick_headword_target_code(self, text, index, lemma):
        # get headwords.
        headwords_for_lemma = get_headwords_for_lemma(lemma)

        if len(headwords_for_lemma) == 1:
            return headwords_for_lemma[0]["target_code"]

        elif len(headwords_for_lemma) == 0:
            return UNSURE

        # >= 2 headwords; actual disambiguation is required

        target_tagged_text = tag_index_with_tgt(text, index)
        self.embedder.get_average_token_embedding(text)
