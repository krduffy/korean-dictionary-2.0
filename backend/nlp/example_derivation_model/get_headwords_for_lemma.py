from typing import List
from words.models import KoreanWord, Sense, SenseExample
from nlp.example_derivation_model.configuration import (
    NUM_REQUIRED_EXAMPLES,
    MAX_EXAMPLES_ON_SENSE,
)

from django.db.models import Count, Prefetch


def _format_lemma_data_into_dict(lemma_data):
    # Each lemma has multiple headwords;
    # Each headword has known_senses
    # Each known sense has definition and list of known usages

    lemma_to_headwords_dict = {}

    for headword in lemma_data.all():
        known_senses = []

        for sense in headword.senses.all():

            example_info = sense.examples.all()

            # This sense does not count !
            if len(example_info) < NUM_REQUIRED_EXAMPLES:
                continue

            example_usages = [
                example_item.example
                for example_item in example_info[:MAX_EXAMPLES_ON_SENSE]
            ]

            known_senses.append(
                {
                    "definition": sense.definition,
                    "known_usages": example_usages,
                }
            )

        if len(known_senses) > 0:
            if not lemma_to_headwords_dict.get(headword.word, None):
                lemma_to_headwords_dict[headword.word] = []
            lemma_to_headwords_dict[headword.word].append(
                {"target_code": headword.target_code, "known_senses": known_senses}
            )

    return lemma_to_headwords_dict


def get_headwords_for_lemmas(lemmas: List[str]) -> dict:

    lemma_data = (
        KoreanWord.objects.filter(word__in=lemmas)
        .prefetch_related(
            Prefetch(
                "senses",
                queryset=Sense.objects.annotate(example_count=Count("examples"))
                .filter(example_count__gte=NUM_REQUIRED_EXAMPLES)
                .only("target_code", "referent_id", "examples", "definition"),
            ),
            Prefetch(
                "senses__examples",
                queryset=SenseExample.objects.only("id", "related_sense_id", "example"),
            ),
        )
        .only("target_code", "word")
    )

    return _format_lemma_data_into_dict(lemma_data)
