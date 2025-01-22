from django.core.management.base import BaseCommand, no_translations
import django

from words.models import KoreanWord, Sense, SenseExample
from django.db.models.functions import Coalesce
from django.db.models import Count

django.setup()

# atm i am deleting them all because many of the examples without { } in the
# base dictionary data are not just improperly formatted without { }.
# they are not examples at all.
# for others, i may eventually go in and manually tag the correct examples
# and fix the formatting but some other time


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):

        annotated_words = KoreanWord.objects.annotate(
            total_examples=Coalesce(Count("senses__examples", distinct=True), 0)
        )

        one_star_requirement = 1
        two_stars_requirement = 5
        three_stars_requirement = 10

        to_save = []
        cumulative_saves = 0
        is_zero_star = 0
        is_one_star = 0
        is_two_stars = 0
        is_three_stars = 0
        total_words = 0
        BATCH_SIZE = 1024

        for word in annotated_words:
            total_words += 1

            words_examples_count = word.total_examples

            if words_examples_count < one_star_requirement:
                is_zero_star += 1
                continue  # stays at 0
            elif words_examples_count < two_stars_requirement:
                is_one_star += 1
                word.result_ranking = 1
            elif words_examples_count < three_stars_requirement:
                is_two_stars += 1
                word.result_ranking = 2
            else:
                is_three_stars += 1
                word.result_ranking = 3

            to_save.append(word)

            if len(to_save) >= BATCH_SIZE:
                saved = KoreanWord.objects.bulk_update(
                    to_save, fields=["result_ranking"]
                )
                to_save = []
                cumulative_saves += saved
                self.stdout.write(
                    f"Saved {saved} words (cumulative {cumulative_saves})"
                )

        self.stdout.write(self.style.SUCCESS("finished updating all words"))
        self.stdout.write(
            f"Stats for word rankings:\n"
            f"{(100 * is_zero_star / total_words):.3f}% are zero stars,\n"
            f"{(100 * is_one_star / total_words):.3f}% are one star,\n"
            f"{(100 * is_two_stars / total_words):.3f}% are two stars,\n"
            f"{(100 * is_three_stars / total_words):.3f}% are three stars\n"
        )
