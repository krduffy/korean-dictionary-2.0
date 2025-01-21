from typing import Tuple
from words.models import KoreanWord, Sense, SenseExample
from nlp.example_derivation_model.configuration import (
    NUM_REQUIRED_EXAMPLES,
    MAX_EXAMPLES_ON_SENSE,
)

from django.db.models import Count, Prefetch


def _format_lemma_data_into_object(lemma_data):
    # Each lemma has multiple headwords;
    # Each headword has known_senses
    # Each known sense has definition and list of known usages

    headword_data = []
    has_any_headword = False

    for headword in lemma_data:
        has_any_headword = True

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
            headword_data.append(
                {"target_code": headword.target_code, "known_senses": known_senses}
            )

    return headword_data, has_any_headword


def get_headwords_for_lemma(lemma: str):

    lemma_data = (
        # has to be word__exact to use index
        KoreanWord.objects.filter(word__exact=lemma)
        .prefetch_related(
            Prefetch(
                "senses",
                queryset=Sense.objects.annotate(example_count=Count("examples"))
                .filter(example_count__gte=NUM_REQUIRED_EXAMPLES)
                .only("examples"),
            ),
            Prefetch("senses__examples", queryset=SenseExample.objects.only("example")),
        )
        .only("target_code")
    )

    return _format_lemma_data_into_object(lemma_data)
