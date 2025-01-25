from django.core.management.base import BaseCommand, no_translations
from hanja.models import HanjaCharacter, HanjaMeaningReading
from hanja.management.dictionary_data.get_huneum import get_huneum
import django
import json
import re

django.setup()


enforced_regex_patterns = {
    "character": r"^[\u4E00-\u9FFF]$",
    "meaning_reading": r"^[가-힣,/ ]+$",
    "radical": r"^([一-龥], \d+획|[一-龥], -\d+획)$",
    "strokes": r"^\d+획$",
    "grade_level": r"^(중학교|고등학교|미배정)(\[\d\])?$",
    "exam_level": r"^(\d급|준\d급|특급|준특급|미배정)(\[\d\])?$",
    "explanation": r".*",
}


def validate_hanja_data(hanja_char_data):
    for field, pattern in enforced_regex_patterns.items():
        value = hanja_char_data.get(field, "")
        if not re.match(pattern, value):
            if not value == "":
                print(
                    "Manually check for character {0}; field {1} violates regex rules.".format(
                        hanja_char_data.get("character", "?"), field
                    )
                )
                return False
    return True


def get_exam_rank_num(exam_rank):
    exam_rank_num = -1

    try:
        exam_rank_num = 2 * int(exam_rank[-2])
    except ValueError:
        pass
    if exam_rank.startswith("준"):
        exam_rank_num += 1
    if "특" in exam_rank:
        exam_rank_num += 1

    return exam_rank_num


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            "--drop",
            action="store_true",
            help="Drops all HanjaCharacters and HanjaMeaningReadings before execution.",
        )
        parser.add_argument("hanja_fname", type=str, help="Path to the hanja JSON file")
        parser.add_argument("hanzi_fname", type=str, help="Path to the hanzi text file")

    @no_translations
    def handle(self, *args, **kwargs):

        drop_all = kwargs["drop"]

        if drop_all:
            HanjaCharacter.objects.all().delete()
            HanjaMeaningReading.objects.all().delete()
            self.stdout.write("Dropped all HanjaCharacters and HanjaMeaningReadings.")

        # usually,
        # hanja_fname = "words\\management\\dictionary_data\\hanja.json"
        # hanzi_fname = "words\\management\\dictionary_data\\makemeahanzi-data.txt"
        hanja_fname = kwargs["hanja_fname"]
        hanzi_fname = kwargs["hanzi_fname"]

        with open(hanja_fname, "r", encoding="utf-8") as main_hanja_file:

            counter = 0
            chars_to_create = []
            meaningreadings_to_create = []

            json_data = json.load(main_hanja_file)

            for hanja_char_data in json_data:
                if hanja_char_data["meaning_reading"] == "":
                    counter += 1
                elif validate_hanja_data(hanja_char_data=hanja_char_data):

                    character = hanja_char_data["character"]
                    meaning_reading = hanja_char_data["meaning_reading"]

                    # only get first char. dataset contains how many strokes remain after the radical
                    # but this can be looked up in the database and is therefore redundant
                    radical = hanja_char_data["radical"][0]
                    # radical_source can be overwritten in a moment if it is also in the hanzi file.
                    # for now, the one from namuwiki is treated as the final one.
                    radical_source = "나무위키"

                    # has to be of the form ^\d+획$ so it converts the beginning part (not 획) into an int
                    # before saving to the database
                    strokes = int(hanja_char_data["strokes"][:-1])
                    grade_level = hanja_char_data["grade_level"]
                    if "[" in grade_level:
                        grade_level = grade_level[:-3]
                    exam_level = hanja_char_data["exam_level"]
                    if "[" in exam_level:
                        exam_level = exam_level[:-3]

                    result_ranking = get_exam_rank_num(exam_level)

                    explanation = hanja_char_data["explanation"]
                    if explanation.endswith("\n"):
                        explanation = explanation[:-1]

                    new_hanja = HanjaCharacter(
                        character=character,
                        radical=radical,
                        radical_source=radical_source,
                        strokes=strokes,
                        grade_level=grade_level,
                        exam_level=exam_level,
                        result_ranking=result_ranking,
                        explanation=explanation,
                    )
                    meaningreading_tuples = get_huneum(meaning_reading)
                    if meaningreading_tuples is not None:

                        new_meaningreadings = [
                            HanjaMeaningReading(
                                referent=new_hanja,
                                meaning=meaningreading[0],
                                readings="".join(
                                    reading for reading in meaningreading[1]
                                ),
                            )
                            for meaningreading in meaningreading_tuples
                        ]

                        meaningreadings_to_create.extend(new_meaningreadings)

                    chars_to_create.append(new_hanja)
                    counter += 1

                if counter % 1000 == 0:
                    self.stdout.write(f"Finished processing {counter} characters")

        written_chars = HanjaCharacter.objects.bulk_create(
            chars_to_create, batch_size=1000
        )
        self.stdout.write(
            self.style.SUCCESS(f"Wrote {len(written_chars)} characters\n")
        )

        written_meaningreadings = HanjaMeaningReading.objects.bulk_create(
            meaningreadings_to_create, batch_size=1000
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Wrote {len(written_meaningreadings)} meaningreadings\n"
            )
        )

        with open(hanzi_fname, "r", encoding="utf-8") as hanzi_file:

            processed = 0
            chars_to_update = []

            for line in hanzi_file:
                line_as_json = json.loads(line)

                character = line_as_json["character"]
                radical = line_as_json["radical"]
                radical_source = "makemeahanzi"
                decomposition = line_as_json["decomposition"]

                if HanjaCharacter.objects.filter(pk=character).exists():
                    model_object = HanjaCharacter.objects.get(pk=character)
                    model_object.radical = radical
                    model_object.decomposition = decomposition
                    model_object.radical_source = radical_source

                    chars_to_update.append(model_object)

                processed += 1
                if processed % 1000 == 0:
                    self.stdout.write(f"Processed {processed} characters in hanzi file")

            updated = HanjaCharacter.objects.bulk_update(
                chars_to_update,
                ["radical", "decomposition", "radical_source"],
                batch_size=1000,
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished reading hanzi file; updated {updated} characters"
            )
        )
        self.stdout.write(self.style.SUCCESS(f"Finished executing command"))
