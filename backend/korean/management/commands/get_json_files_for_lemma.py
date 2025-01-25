from django.core.management.base import BaseCommand, no_translations
from korean.models import KoreanHeadword
import django
import json

django.setup()


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        lemmas = ["절", "팔", "김", "차", "상", "눈", "밤", "벌", "말"]

        for lemma in lemmas:
            lemma_data = KoreanHeadword.objects.prefetch_related("senses").filter(
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
                            example_item["example"] for example_item in example_info
                        ]

                    known_senses.append(
                        {
                            "definition": sense.definition,
                            "known_usages": example_usages,
                        }
                    )

                headword_data.append({"known_senses": known_senses})

            full_object = {
                "lemma": lemma,
                "known_headwords": headword_data,
                # initialized to have 1 empty usage example to be filled in.
                "unknown_usage_examples": [
                    {"usage": "", "source": "", "index_of_correct_headword": -1}
                ],
            }

            filepath = f"C:\\Users\\12679\\Documents\\git\\find-korean-sense-examples\\inputs\\kor\\ignore\\{lemma}.json"
            with open(filepath, "w+", encoding="utf-8") as file:
                json.dump(
                    full_object,
                    file,
                    indent=4,
                    ensure_ascii=False,
                )
