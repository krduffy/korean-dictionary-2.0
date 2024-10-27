from words.models import KoreanWord


class WordUtilsMixin:
    """Mixin that provides functionality for adding words to the list of studied and known words."""

    @classmethod
    def studied_words_addall(self, user, pks):
        for pk in pks:
            kw = KoreanWord.objects.all().get(pk=pk)
            user.studied_words.add(kw)

    @classmethod
    def known_words_addall(self, user, pks):
        for pk in pks:
            kw = KoreanWord.objects.all().get(pk=pk)
            user.known_words.add(kw)
