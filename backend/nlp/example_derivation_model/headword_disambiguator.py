from typing import List
from nlp.example_derivation_model.types import LEMMA_AMBIGUOUS, KnownHeadwordInformation
from nlp.example_derivation_model.target_lemma_taggers import tag_index_with_tgt
from nlp.example_derivation_model.embedder import Embedder
from nlp.example_derivation_model.similarity_calculator import (
    get_similarities_of_definitions,
    get_similarities_of_examples,
)
from nlp.example_derivation_model.configuration import (
    DEFINITION_WEIGHT,
    EXAMPLE_WEIGHT,
    ACCEPTANCE_MIN_SCORE,
    ACCEPTANCE_MIN_DELTA,
)


class HeadwordDisambiguator:

    def __init__(self):
        self.embedder = Embedder()

    def pick_headword_from_choices(
        self, text: str, index: int, headwords_for_lemma: List[KnownHeadwordInformation]
    ) -> int:
        definition_scores = self._get_scores_for_definitions(text, headwords_for_lemma)
        example_scores = self._get_scores_for_examples(text, index, headwords_for_lemma)

        scores = [
            (ds * DEFINITION_WEIGHT + es * EXAMPLE_WEIGHT, index)
            for index, (ds, es) in enumerate(zip(definition_scores, example_scores))
        ]

        scores.sort(reverse=True)

        if scores[0][0] < ACCEPTANCE_MIN_SCORE:
            return LEMMA_AMBIGUOUS
        if scores[0][0] - scores[1][0] < ACCEPTANCE_MIN_DELTA:
            return LEMMA_AMBIGUOUS
        return headwords_for_lemma[scores[0][1]]["target_code"]

    def _get_scores_for_definitions(
        self, text: str, headwords_for_lemma: List[KnownHeadwordInformation]
    ):
        text_average_token_embedding = self.embedder.get_average_token_embedding(text)
        definitions_average_token_embeddings = (
            self.embedder.get_average_token_embeddings_for_headword_sense_definitions(
                headwords_for_lemma
            )
        )

        return get_similarities_of_definitions(
            text_average_token_embedding, definitions_average_token_embeddings
        )

    def _get_scores_for_examples(
        self, text: str, index: int, headwords_for_lemma: List[KnownHeadwordInformation]
    ):
        # Getting embeddings for similarities of TGT in sense examples and the
        # input text

        target_tagged_text = tag_index_with_tgt(text, index)

        print("len of text is", len(target_tagged_text.split(" ")))

        text_embedding_for_lemma = self.embedder.get_embedding_from_tgt_marked_text(
            target_tagged_text
        )

        examples_embeddings_for_lemma = (
            self.embedder.get_lemma_embeddings_for_headword_sense_known_usages(
                headwords_for_lemma
            )
        )

        return get_similarities_of_examples(
            text_embedding_for_lemma, examples_embeddings_for_lemma
        )
