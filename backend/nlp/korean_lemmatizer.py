from typing import List


class KoreanLemmatizer:

    def __init__(self, *, attach_다_to_verbs: bool):
        from mecab import MeCab

        self.mecab = MeCab()
        self.attach_다_to_verbs = attach_다_to_verbs

    def _group_morphs_by_token(self, parsed_morphs: List) -> List[List]:

        spans = [morph.span for morph in parsed_morphs]

        grouped = []

        span_cur = 0
        last_end = 0
        while span_cur < len(spans):
            this_group = []

            while span_cur < len(spans) and spans[span_cur].start == last_end:
                this_group.append(parsed_morphs[span_cur])
                last_end = spans[span_cur].end
                span_cur += 1

            # added all of the consecutive tokens in the while loop above;
            # now there is a number of whitespaces that need to be moved past
            # so the next iteration of outer while loop is able to initialize
            # cur at the start of the next string
            if span_cur < len(spans):
                last_end = spans[span_cur].start

            grouped.append(this_group)

        return grouped

    def _is_morph_kept(self, morph) -> bool:

        pos = morph.feature.pos

        cannot_start_with = ["J", "E", "S"]

        for prefix in cannot_start_with:
            if pos.startswith(prefix):
                return False

        return True

    def _trim_morphs(self, grouped_morphs: List[List]) -> List[List]:
        return [
            [morph for morph in morph_list if self._is_morph_kept(morph)]
            for morph_list in grouped_morphs
        ]

    def _remove_eomi_from_verb(self, morph) -> str:
        return morph.feature.expression.split("/")[0]

    def _get_lemma_from_morph(self, morph) -> str:
        pos = morph.feature.pos

        if pos.startswith("V"):
            stem = self._remove_eomi_from_verb(morph) if "+" in pos else morph.surface
            if self.attach_다_to_verbs:
                return stem + "다"
            return stem

        return morph.surface

    def _get_lemmas_from_trimmed_grouped_morphs(
        self, trimmed_grouped_morphs: List[List]
    ) -> List[List[str]]:
        return [
            [self._get_lemma_from_morph(morph) for morph in morph_list]
            for morph_list in trimmed_grouped_morphs
        ]

    def get_lemmas(self, text: str) -> List[List[str]]:
        parsed_morphs = self.mecab.parse(text)

        grouped_morphs = self._group_morphs_by_token(parsed_morphs)
        trimmed_grouped_morphs = self._trim_morphs(grouped_morphs)

        return self._get_lemmas_from_trimmed_grouped_morphs(trimmed_grouped_morphs)

    def find_index_of_lemma(self, context: str, target_lemma: str) -> int:
        lemmas = self.get_lemmas(context)

        for i, lemma_list_for_token in enumerate(lemmas):
            if target_lemma in lemma_list_for_token:
                return i

        return -1

    def get_lemma_at_index(self, context: str, index: int) -> str:
        lemmas = self.get_lemmas(context)

        try:
            return lemmas[index][0]
        except IndexError:
            return ""
