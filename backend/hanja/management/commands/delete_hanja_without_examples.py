from django.core.management.base import BaseCommand, no_translations
from hanja.models import HanjaCharacter
from korean.models import KoreanHeadword
import django

django.setup()


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        delete_return = 0
        processed = 0

        for hanja in HanjaCharacter.objects.all():
            if not KoreanHeadword.objects.filter(
                origin__icontains=hanja.character
            ).exists():
                hanja.delete()
                delete_return += 1

            processed += 1
            if processed % 100 == 0:
                self.stdout.write(f"Processed {processed} characters")

        self.stdout.write(self.style.SUCCESS(f"Deleted: {delete_return}"))
