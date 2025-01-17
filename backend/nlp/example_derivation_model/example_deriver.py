from django.core.files.uploadedfile import InMemoryUploadedFile

from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.get_headwords_for_lemma import get_headwords_for_lemma
from nlp.example_derivation_model.target_lemma_taggers import (
    tag_index_with_tgt,
)


class ExampleDeriver:

    def __init__(self):
        self.lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)

    def derive_examples(self, in_memory_file: InMemoryUploadedFile):
        in_memory_file.open(mode="rb")

        for i, bytes in enumerate(in_memory_file.chunks()):
            text = bytes.decode("utf-8")
            print(f"text {i} is {text}")
            print("here are lemmas")
            self.__iterate_through_lemmas(text)

    def __iterate_through_lemmas(self, text):
        all_lemmas = self.lemmatizer.get_lemmas(text)

        c = 0

        for index, lemma_list_at_index in enumerate(all_lemmas):
            for lemma in lemma_list_at_index:

                target_tagged_text = tag_index_with_tgt(text, index)
                headwords_for_lemma = get_headwords_for_lemma(lemma)

                print(target_tagged_text)
                print(headwords_for_lemma)

                c += 1
                if c > 0:
                    break
            if c > 0:
                break
