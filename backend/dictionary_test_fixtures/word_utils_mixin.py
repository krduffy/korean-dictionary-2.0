from korean.models import KoreanHeadword


class WordUtilsMixin:
    """Mixin that provides functionality for adding words to the list of studied and known words."""

    @classmethod
    def studied_headwords_addall(self, user, pks):
        for pk in pks:
            kw = KoreanHeadword.objects.all().get(pk=pk)
            user.studied_headwords.add(kw)

    @classmethod
    def known_headwords_addall(self, user, pks):
        for pk in pks:
            kw = KoreanHeadword.objects.all().get(pk=pk)
            user.known_headwords.add(kw)
