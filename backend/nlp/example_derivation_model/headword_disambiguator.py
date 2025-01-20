from typing import List

import torch
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

    def get_average_token_embeddings_for_headword_sense_definitions(
        self, known_headwords: List[KnownHeadwordInformation]
    ) -> List[List[torch.Tensor]]:
        return [
            [
                self.get_average_token_embedding(known_sense["definition"])
                for known_sense in headword["known_senses"]
            ]
            for headword in known_headwords
        ]

    def _get_scores_for_definitions(
        self, text: str, headwords_for_lemma: List[KnownHeadwordInformation]
    ):
        # First index is the text,
        # Remaining indices are flattened definitions from headwords_for_lemma

        embedder_input_texts = [text]

        headword_sense_shape: List[int] = []

        for headword in headwords_for_lemma:
            headword_sense_shape.append(len(headword["known_senses"]))
            embedder_input_texts.extend(
                [sense["definition"] for sense in headword["known_senses"]]
            )

        all_embeddings = self.embedder.get_average_token_embeddings(
            embedder_input_texts
        )

        text_average_token_embedding = all_embeddings[0]

        start_cur = 1
        end_cur = -1
        definitions_average_token_embeddings = []

        for num_of_definitions in headword_sense_shape:
            end_cur = start_cur + num_of_definitions
            definitions_average_token_embeddings.append(
                all_embeddings[start_cur:end_cur]
            )
            start_cur = end_cur

        return get_similarities_of_definitions(
            text_average_token_embedding, definitions_average_token_embeddings
        )

    def _get_scores_for_examples(
        self, text: str, index: int, headwords_for_lemma: List[KnownHeadwordInformation]
    ):
        # Getting embeddings for similarities of TGT in sense examples and the
        # input text

        target_tagged_text = tag_index_with_tgt(text, index)
        embedder_input_texts: List[str] = [target_tagged_text]

        headword_sense_example_shape: List[List[int]] = []

        for headword in headwords_for_lemma:
            headword_sense_example_shape.append(
                [len(sense["known_usages"]) for sense in headword["known_senses"]]
            )
            embedder_input_texts.extend(
                [
                    known_usage
                    for sense in headword["known_senses"]
                    for known_usage in sense["known_usages"]
                ]
            )

        all_embeddings = self.embedder.get_embeddings_from_tgt_marked_texts(
            embedder_input_texts
        )

        text_embedding_for_lemma = all_embeddings[0]

        start_cur = 1
        end_cur = -1
        examples_embeddings_for_lemma: List[List[torch.Tensor]] = []

        for headwords_senses_example_count_list in headword_sense_example_shape:
            this_list_of_tensors = []

            for senses_example_count in headwords_senses_example_count_list:
                end_cur = start_cur + senses_example_count
                this_list_of_tensors.append(all_embeddings[start_cur:end_cur])
                start_cur = end_cur

            examples_embeddings_for_lemma.append(this_list_of_tensors)

        return get_similarities_of_examples(
            text_embedding_for_lemma, examples_embeddings_for_lemma
        )
