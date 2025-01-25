from django.core.management.base import BaseCommand, no_translations
from korean.models import Sense
import django


django.setup()


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        all_senses = Sense.objects.all()
        to_save = []

        for sense in all_senses:
            if "<DR />" in sense.definition:
                new = ""
                try:
                    new = ", ".join(
                        region_dict["region"]
                        for region_dict in sense.additional_info["region_info"]
                    )
                    sense.definition = sense.definition.replace("<DR />", new + ".")
                    to_save.append(sense)
                except Exception as e:
                    print(e)

        Sense.objects.bulk_update(to_save, ["definition"], 1000)
