import re
from django.core.management.base import BaseCommand, no_translations
import django

from korean.models import SenseExample

django.setup()

# atm i am deleting them all because many of the examples without { } in the
# base dictionary data are not just improperly formatted without { }.
# they are not examples at all.
# for others, i may eventually go in and manually tag the correct examples
# and fix the formatting but some other time


def has_proper_tags(example: str) -> bool:
    pattern = r".*\[TGT\].+\[/TGT\]"
    found_match = re.match(pattern, example) is not None
    return found_match


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        to_delete = []

        for sense_example in SenseExample.objects.only("example", "pk").all():
            if not has_proper_tags(sense_example.example):
                to_delete.append(sense_example.pk)

        SenseExample.objects.filter(pk__in=to_delete).delete()
