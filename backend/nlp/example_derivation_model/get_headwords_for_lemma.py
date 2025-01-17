from words.models import KoreanWord
from nlp.example_derivation_model.target_lemma_taggers import tag_first_curly_with_tgt
from nlp.example_derivation_model.configuration import NUM_REQUIRED_EXAMPLES


def get_headwords_for_lemma(lemma: str):

    lemma_data = KoreanWord.objects.prefetch_related("senses").filter(
        word__iexact=lemma
    )

    # Each lemma has multiple headwords;
    # Each headword has known_senses
    # Each known sense has definition and list of known usages

    headword_data = []

    for headword in lemma_data:
        headword_senses = headword.senses.all()

        known_senses = []

        for sense in headword_senses:

            example_usages = []
            example_info = sense.additional_info.get("example_info", None)

            # This sense does not count !
            if example_info is None or len(example_info) < NUM_REQUIRED_EXAMPLES:
                continue

            example_usages = [
                tag_first_curly_with_tgt(example_item["example"])
                for example_item in example_info
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

    return headword_data
