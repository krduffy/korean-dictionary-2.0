from django.core.management.base import BaseCommand, no_translations
from nlp.models import SkippedLemma
import django

django.setup()


class Command(BaseCommand):

    @no_translations
    def handle(self, *args, **kwargs):
        # Lemmas that are very frequent and in general waste the time of the
        # algorithm and the user. They are not worth adding since they are
        # already full of examples anyway and most people would know them
        # within a few days of learning. In some cases like 우리, there are
        # legimitately multiple headwords that necessitate disambiguation
        # but from testing, the model will almost never pick the
        # nonproform/nondeterminer/otherwise less common meaning anyways
        # Completely refusing to do anything with them is better

        # I will continue to add to this. There will likely be 100+ when all is said
        # and done

        # ! It may be worthwhile to force all lemmas of len 1 and an ambiguous set of
        # headwords to by default be banned. words like 주, 분, 전, ... which are not
        # "stop words" which most of the ones below could probably be called

        # 두번이상 나오는 단어도 있음
        # + 목록이 아직 정밀하지는 않음
        skipped_lemmas = """
          저 나 너 당신 우리 그 이 저 수 지 데 때
          이다 아니다 하다 지다 보다 의하다 있다 없다 먹다 따르다
          적 한 번 다 전 만 등 조금 좀
        """.split()

        skipped_lemmas = set(skipped_lemmas)

        skipped_lemmas = [
            SkippedLemma(pk=banned_lemma) for banned_lemma in skipped_lemmas
        ]

        SkippedLemma.objects.all().delete()
        created = SkippedLemma.objects.bulk_create(skipped_lemmas)
        self.stdout.write(self.style.SUCCESS(f"Wrote {len(created)} lemmas\n"))
