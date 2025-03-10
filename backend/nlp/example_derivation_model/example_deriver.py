from typing import List, Tuple
from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
    LEMMA_ALREADY_DISAMBIGUATED,
)
from nlp.example_derivation_model.headword_disambiguator import (
    KoreanHeadwordDisambiguator,
)
from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.get_headwords_for_lemma import (
    get_headwords_for_lemmas,
)
from nlp.example_derivation_model.skipped_lemmas import skipped_lemmas_set
from nlp.example_derivation_model.configuration import (
    SUBTEXT_TARGET_CHARACTER_LENGTH,
    LEMMA_BATCH_SIZE,
)


class ExampleDeriver:

    def __init__(self):
        self.lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
        self.headword_disambiguator = KoreanHeadwordDisambiguator()
        self.already_disambiguated_set = set()
        # deepcopy
        self.skipped_lemmas_set = set(skipped_lemmas_set)

    def _get_split_texts(self, text: str) -> List[str]:
        """Splits a text into a number of smaller strings to be input into
        the model. Done to limit the amount of tokens that need to be
        tokenized"""
        paragraphs = text.split("\n")

        current_text = ""
        current_length = 0

        texts = []

        for paragraph in paragraphs:
            paragraph_length = len(paragraph)

            if paragraph_length + current_length > SUBTEXT_TARGET_CHARACTER_LENGTH:
                texts.append(current_text)

                current_text = paragraph
                current_length = paragraph_length
            elif current_length > 0:
                current_text += "\n" + paragraph
                current_length += paragraph_length
            else:
                current_text = paragraph
                current_length = paragraph_length

        if current_text:
            texts.append(current_text)

        return texts

    def _run_batch(self, text, batch):

        reached_stages, target_codes = self._pick_headword_target_codes(
            text, [batched[0] for batched in batch], [batched[1] for batched in batch]
        )

        for i, (reached_stage, target_code) in enumerate(
            zip(reached_stages, target_codes)
        ):
            yield {
                "lemma": batch[i][1],
                "headword_pk": target_code,
                "reached_stage": reached_stage,
                "eojeol_num": batch[i][2],
            }

    def generate_examples_in_text(self, text, ignored_headwords: str):

        input_texts = self._get_split_texts(text)

        ignored_headwords_list = ignored_headwords.strip().split(" ")
        ignored_headwords_set = set(
            [headword for headword in ignored_headwords_list if len(headword) > 0]
        )
        self.skipped_lemmas_set.update(ignored_headwords_set)

        # running number regardless of split input texts' boundaries
        eojeol_num = 0

        # Batches lemmas together to run all of the database queries +
        # bert embeddings (if applicable) together
        batch = []

        for input_text in input_texts:

            all_lemmas = self.lemmatizer.get_lemmas(input_text)

            for index, lemma_list_at_index in enumerate(all_lemmas):
                for lemma in lemma_list_at_index:

                    batch.append((index, lemma, eojeol_num))

                    if len(batch) >= LEMMA_BATCH_SIZE:
                        yield from self._run_batch(input_text, batch)
                        batch.clear()

                eojeol_num += 1

            # have to run any remaining
            if len(batch) > 0:
                yield from self._run_batch(input_text, batch)
                batch.clear()

    def _fill_skipped_lemmas(
        self,
        returned: List[int],
        needs_checking: List[bool],
        reached: List[int],
        lemmas: List[str],
    ) -> bool:
        done = True

        for i, lemma in enumerate(lemmas):
            if not needs_checking[i]:
                continue
            if lemma in self.skipped_lemmas_set:
                returned[i] = LEMMA_IGNORED
                reached[i] = 1
                needs_checking[i] = False
            else:
                done = False

        return done

    def _fill_already_disambiguated(
        self,
        returned: List[int],
        needs_checking: List[bool],
        reached: List[int],
        lemmas: List[str],
    ) -> bool:
        done = True

        for i, lemma in enumerate(lemmas):
            if not needs_checking[i]:
                continue
            if lemma in self.already_disambiguated_set:
                returned[i] = LEMMA_ALREADY_DISAMBIGUATED
                needs_checking[i] = False
                reached[i] = 2
            else:
                done = False

        return done

    def _fill_requires_headword_fetch(
        self,
        returned: List[int],
        needs_checking: List[bool],
        reached: List[int],
        lemmas: List[str],
    ) -> Tuple[bool, dict]:
        lemmas_to_fetch = [lemma for i, lemma in enumerate(lemmas) if needs_checking[i]]

        lemma_headword_data_dict = get_headwords_for_lemmas(lemmas_to_fetch)

        done = True

        for i, lemma in enumerate(lemmas):

            if not needs_checking[i]:
                continue

            headword_data = lemma_headword_data_dict.get(lemma, [])

            if len(headword_data) == 1:
                returned[i] = headword_data[0]["target_code"]
                reached[i] = 3
                needs_checking[i] = False

            elif len(headword_data) == 0:
                returned[i] = LEMMA_AMBIGUOUS
                reached[i] = 3
                needs_checking[i] = False

            else:
                done = False

        return done, lemma_headword_data_dict

    def _fill_requires_disambiguation(
        self,
        returned: List[int],
        reached: List[int],
        needs_checking: List[bool],
        text: str,
        indices: List[int],
        lemmas: List[str],
        lemma_headword_data_dict: dict,
    ) -> bool:

        # not eojeol number (which is kept in the indices array passed to this
        # function); this is measuring indices in the `returned` array so that
        # the order of the results from batch headword pickings know where to
        # be placed
        relevant_indices = [
            index for i, index in enumerate(indices) if needs_checking[i]
        ]
        relevant_headwords = [
            lemma_headword_data_dict[lemma]
            for i, lemma in enumerate(lemmas)
            if needs_checking[i]
        ]

        all_pks = self.headword_disambiguator.pick_headword_from_choices_batch(
            text, relevant_indices, relevant_headwords
        )

        def generate_list(list):
            for val in list:
                yield val

        all_pks_generator = generate_list(all_pks)

        for i in range(len(needs_checking)):
            if not needs_checking[i]:
                continue
            returned[i] = all_pks_generator.__next__()
            reached[i] = 4
            needs_checking[i] = False

        return True

    def _pick_headword_target_codes(
        self, text: str, indices: List[int], lemmas: List[str]
    ) -> Tuple[List[int], List[int]]:
        """Returns a list of pks"""

        returned = [None for _ in range(len(indices))]
        needs_checking = [True for _ in range(len(indices))]
        reached = [0 for _ in range(len(indices))]

        done = self._fill_skipped_lemmas(returned, needs_checking, reached, lemmas)
        if done:
            return (reached, returned)

        done = self._fill_already_disambiguated(
            returned, needs_checking, reached, lemmas
        )
        if done:
            return (reached, returned)

        done, lemma_headword_data_dict = self._fill_requires_headword_fetch(
            returned, needs_checking, reached, lemmas
        )
        if done:
            return (reached, returned)

        done = self._fill_requires_disambiguation(
            returned,
            reached,
            needs_checking,
            text,
            indices,
            lemmas,
            lemma_headword_data_dict,
        )
        return (reached, returned)
