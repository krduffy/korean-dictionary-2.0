from typing import List
import torch
from nlp.example_derivation_model.configuration import (
    single_senses_definitions_similarity_flattener,
    single_senses_examples_similarity_flattener,
    all_senses_examples_similarity_flattener,
)


def _get_similarity_of_tensors(t1: torch.Tensor, t2: torch.Tensor) -> float:
    t1, t2 = t1.squeeze(0), t2.squeeze(0)
    similarity = torch.cosine_similarity(t1, t2, dim=0)
    return similarity.item()


def get_similarities_of_definitions(
    text_average_token_embedding: torch.Tensor,
    definitions_average_token_embeddings: List[List[torch.Tensor]],
) -> List[float]:
    before_flattening = [
        [
            _get_similarity_of_tensors(
                text_average_token_embedding, definition_embedding
            )
            for definition_embedding in sense_definition_set_embeddings
        ]
        for sense_definition_set_embeddings in definitions_average_token_embeddings
    ]

    return [
        single_senses_definitions_similarity_flattener(similarities)
        for similarities in before_flattening
    ]


def get_similarities_of_examples(
    text_embedding_for_lemma: torch.Tensor,
    examples_embeddings_for_lemma: List[List[List[torch.Tensor]]],
) -> List[float]:

    headword_similarities = []

    for headword in examples_embeddings_for_lemma:
        sense_similarities = []

        for known_sense in headword:
            # Calculate similarities for all usage examples of this sense.
            usage_similarities = [
                _get_similarity_of_tensors(text_embedding_for_lemma, known_embedding)
                for known_embedding in known_sense
            ]

            # Flatten similarities for this sense.
            sense_similarity = single_senses_examples_similarity_flattener(
                usage_similarities
            )
            sense_similarities.append(sense_similarity)

        # Flatten sense similarities for this headword.
        headword_similarity = all_senses_examples_similarity_flattener(
            sense_similarities
        )
        headword_similarities.append(headword_similarity)

    return headword_similarities
