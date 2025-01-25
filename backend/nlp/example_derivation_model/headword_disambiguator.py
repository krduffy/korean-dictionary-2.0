from typing import List

import torch
from nlp.example_derivation_model.types import (
    LEMMA_AMBIGUOUS,
    KnownKoreanHeadwordInformation,
)
from nlp.example_derivation_model.target_lemma_taggers import tag_indices_with_tgt
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


class KoreanHeadwordDisambiguator:

    def __init__(self):
        self.embedder = Embedder()

    def pick_headword_from_choices_batch(
        self,
        text: str,
        indices: List[int],
        headwords_for_lemmas: List[List[KnownKoreanHeadwordInformation]],
    ) -> List[int]:

        all_definition_scores = self._get_scores_for_definitions_batch(
            text, headwords_for_lemmas
        )
        all_example_scores = self._get_scores_for_examples_batch(
            text, indices, headwords_for_lemmas
        )

        return [
            self._pick_headword_from_choices(
                all_definition_scores[i],
                all_example_scores[i],
                [headword["target_code"] for headword in headwords_for_lemmas[i]],
            )
            for i in range(len(indices))
        ]

    def _pick_headword_from_choices(
        self,
        definition_scores: List[float],
        example_scores: List[float],
        target_codes: List[int],
    ) -> int:
        scores = [
            (ds * DEFINITION_WEIGHT + es * EXAMPLE_WEIGHT, index)
            for index, (ds, es) in enumerate(zip(definition_scores, example_scores))
        ]

        scores.sort(reverse=True)

        if scores[0][0] < ACCEPTANCE_MIN_SCORE:
            return LEMMA_AMBIGUOUS
        if scores[0][0] - scores[1][0] < ACCEPTANCE_MIN_DELTA:
            return LEMMA_AMBIGUOUS
        return target_codes[scores[0][1]]

    def _get_scores_for_definitions_batch(
        self,
        text: str,
        headwords_for_lemmas: List[List[KnownKoreanHeadwordInformation]],
    ):
        # list of lists where a number in an inner list indicates the number
        # of definitions for the indexed lemma
        # [ [4, 6], [1, 3] ]
        # ^ In this example,
        # the first lemma has 2 headwords, the first of which has 4 definitions(senses)
        # and the second of which has 6 headwords.
        # the second has 2 headwords with 1 and 3 senses.
        lemma_headwords_shape: List[List[int]] = []

        embedder_input_texts: List[str] = [text]

        for lemma in headwords_for_lemmas:
            lemmas_shape = []
            for headword in lemma:
                lemmas_shape.append(len(headword["known_senses"]))
                embedder_input_texts.extend(
                    [sense["definition"] for sense in headword["known_senses"]]
                )
            lemma_headwords_shape.append(lemmas_shape)

        all_embeddings = self.embedder.get_average_token_embeddings(
            embedder_input_texts
        )

        text_average_token_embedding = all_embeddings[0]

        start_cur = 1
        end_cur = -1
        definitions_average_token_embeddings: List[List[List[int]]] = []

        for headword in lemma_headwords_shape:
            headword_senses_average_token_embeddings = []

            for num_senses in headword:
                end_cur = start_cur + num_senses
                headword_senses_average_token_embeddings.append(
                    all_embeddings[start_cur:end_cur]
                )
                start_cur = end_cur

            definitions_average_token_embeddings.append(
                headword_senses_average_token_embeddings
            )

        return [
            get_similarities_of_definitions(
                text_average_token_embedding, headword_senses_average_token_embeddings
            )
            for headword_senses_average_token_embeddings in definitions_average_token_embeddings
        ]

    def _get_scores_for_examples_batch(
        self,
        text: str,
        indices: List[int],
        headwords_for_lemmas: List[List[KnownKoreanHeadwordInformation]],
    ):
        # Getting embeddings for similarities of TGT in sense examples and the
        # input text

        target_tagged_texts = tag_indices_with_tgt(text, indices)
        embedder_input_texts: List[str] = [
            target_tagged_text for target_tagged_text in target_tagged_texts
        ]

        # x = [ [ [4], [6, 1] ], [ [3] ] ]
        # ^ In this example,
        # there are 2 batched lemmas;
        # the first lemma's info is in x[0]
        # x[0][0] is the first lemma's first headword
        # x[0][0][0] is that first headword's first and only sense,
        #    which has 4 examples
        # x[0][1][0] is the first lemmas's second headword's first sense
        #    with 6 examples
        # and so on
        lemma_headword_sense_example_shape: List[List[List[int]]] = []

        for lemma in headwords_for_lemmas:
            lemmas_shape = []
            for headword in lemma:
                lemmas_shape.append(
                    [len(sense["known_usages"]) for sense in headword["known_senses"]]
                )
                embedder_input_texts.extend(
                    [
                        known_usage
                        for sense in headword["known_senses"]
                        for known_usage in sense["known_usages"]
                    ]
                )
            lemma_headword_sense_example_shape.append(lemmas_shape)

        all_embeddings = self.embedder.get_embeddings_from_tgt_marked_texts(
            embedder_input_texts
        )

        target_tagged_text_embeddings = all_embeddings[: len(indices)]

        start_cur = len(indices)
        end_cur = -1
        examples_embeddings_for_lemmas: List[List[List[List[torch.Tensor]]]] = []

        for (
            lemma_headwords_senses_example_count_list
        ) in lemma_headword_sense_example_shape:
            this_list_of_tensors = []

            for (
                headwords_senses_example_count_list
            ) in lemma_headwords_senses_example_count_list:
                inner_list = []

                for senses_example_count in headwords_senses_example_count_list:
                    end_cur = start_cur + senses_example_count
                    inner_list.append(all_embeddings[start_cur:end_cur])
                    start_cur = end_cur
                this_list_of_tensors.append(inner_list)

            examples_embeddings_for_lemmas.append(this_list_of_tensors)

        return [
            get_similarities_of_examples(
                target_tagged_text_embeddings[i], lemmas_embeddings
            )
            for i, lemmas_embeddings in enumerate(examples_embeddings_for_lemmas)
        ]
