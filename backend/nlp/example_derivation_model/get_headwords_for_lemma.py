from words.models import KoreanWord
from nlp.example_derivation_model.target_lemma_taggers import tag_first_curly_with_tgt


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

            if example_info is not None:
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

        headword_data.append({"known_senses": known_senses})

    return headword_data
