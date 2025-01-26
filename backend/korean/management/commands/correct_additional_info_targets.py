from django.core.management.base import (
    BaseCommand,
    no_translations,
)
from korean.models import Sense
import django

django.setup()


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        BATCH_SIZE = 5000

        # For relation_info:
        # 1. delete 001, 002 etc numbers at end of word string and remove ^ and -
        # 2. change target_code of word from its sense target code to the word's target code
        # 3. remove link (unused).

        senses_to_update = []
        cumulative_saved = 0

        for sense in Sense.objects.all():

            changed = False

            if (
                "relation_info" in sense.additional_info
                and sense.additional_info["relation_info"]
            ):

                for relinfo in sense.additional_info["relation_info"]:
                    relinfo["word"] = (
                        relinfo.get("word", "").replace("-", "").replace("^", "")[:-3]
                    )
                    try:
                        relinfo["link_target_code"] = Sense.objects.get(
                            target_code=relinfo["link_target_code"]
                        ).headword_ref.pk
                    except Sense.DoesNotExist:
                        relinfo.pop("link_target_code", None)
                    relinfo.pop("link", None)

                changed = True

            # For proverb info:
            # 1. Change target code as above.
            # 2. Remove link as above.
            if (
                "proverb_info" in sense.additional_info
                and sense.additional_info["proverb_info"]
            ):
                for provinfo in sense.additional_info["proverb_info"]:
                    try:
                        provinfo["link_target_code"] = Sense.objects.get(
                            target_code=provinfo["link_target_code"]
                        ).headword_ref.pk
                    except Sense.DoesNotExist:
                        provinfo.pop("link_target_code", None)
                    provinfo.pop("link", None)

                changed = True

            if changed:
                senses_to_update.append(sense)

            if len(senses_to_update) >= BATCH_SIZE:
                num_saved = Sense.objects.bulk_update(
                    senses_to_update, ["additional_info"]
                )
                cumulative_saved += num_saved
                self.stdout.write(
                    f"Saved {num_saved} senses. (cumulative {cumulative_saved})"
                )
                senses_to_update = []

        if senses_to_update:
            num_saved = Sense.objects.bulk_update(senses_to_update, ["additional_info"])
            cumulative_saved += num_saved
            self.stdout.write(
                f"Saved {num_saved} senses. (cumulative {cumulative_saved})"
            )
            senses_to_update = []

        self.stdout.write(self.style.SUCCESS("Finished executing command"))
