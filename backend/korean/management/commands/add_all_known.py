from django.core.management.base import (
    BaseCommand,
    no_translations,
)
from korean.models import KoreanHeadword
from users.models import User
import django

django.setup()


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        known_file = "korean/management/dictionary_data/known.csv"
        known_pks_to_add = []
        user_id = 1

        with open(known_file, "r") as file:
            file.readline()

            all_lines = file.readlines()
            known_pks_to_add = [int(line) for line in all_lines]

        user = User.objects.get(pk=user_id)

        headword_instances = KoreanHeadword.objects.filter(
            target_code__in=known_pks_to_add
        )

        user.known_headwords.add(*headword_instances)
        user.save()
