import re
from django.core.management.base import BaseCommand, CommandError, no_translations
import django
from django.db import transaction

from words.models import Sense, SenseExample


django.setup()


def tag_curly_with_tgt(example: str) -> str:
    replaced = example.replace("{", "[TGT]").replace("}", "[/TGT]")
    return replaced


def has_proper_tags(example: str) -> bool:
    pattern = r".*\[TGT\].+\[/TGT\]"
    found_match = re.match(pattern, example) is not None
    return found_match


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        senses_to_update = []
        examples_to_create = []
        total_added = 0
        BATCH_SIZE = 10000

        try:
            with transaction.atomic():

                for sense in Sense.objects.all():

                    if sense.additional_info.get("example_info", None) is None:
                        continue

                    for example in sense.additional_info["example_info"]:

                        new_example_text = tag_curly_with_tgt(example["example"])

                        examples_to_create.append(
                            SenseExample(
                                related_sense=sense,
                                example=new_example_text,
                                source=example.get("source"),
                                translation=example.get("translation"),
                                origin=example.get("origin"),
                                region=example.get("region"),
                            )
                        )

                    sense.additional_info.pop("example_info", None)
                    senses_to_update.append(sense)

                    if len(examples_to_create) >= BATCH_SIZE:
                        created = SenseExample.objects.bulk_create(examples_to_create)
                        total_added += len(created)

                        self.stdout.write(
                            f"Created {len(created)} examples in bulk. "
                            + f"(cumulative {total_added})"
                        )

                        examples_to_create = []

                        updated = Sense.objects.bulk_update(
                            senses_to_update, fields=["additional_info"]
                        )
                        self.stdout.write(f"Updated {updated} senses in bulk.")

                        senses_to_update = []

                if examples_to_create:
                    created = SenseExample.objects.bulk_create(examples_to_create)
                    total_added += len(created)

                    self.stdout.write(
                        f"Created {len(created)} examples in bulk. "
                        + f"(cumulative {total_added})"
                    )

                if senses_to_update:
                    updated = Sense.objects.bulk_update(
                        senses_to_update, fields=["additional_info"]
                    )
                    self.stdout.write(f"Updated {updated} senses in bulk.")

                self.stdout.write(
                    "These pks have improper formatting and need manual edits"
                )

                improperly_formatted = []
                for sense_example in SenseExample.objects.all():
                    if not has_proper_tags(sense_example.example):
                        improperly_formatted.append(sense_example.pk)

                self.stdout.write(str(improperly_formatted))
        except CommandError as e:
            self.stdout.write(self.style.ERROR(f"Error occurred: {e}"))
        else:
            self.stdout.write(
                self.style.SUCCESS("Successfully finished executing command")
            )
