from typing import List, Tuple
import torch

from nlp.example_derivation_model.types import KnownHeadwordInformation

# import random
# import numpy as np

# seed_val = 77
# random.seed(seed_val)
# np.random.seed(seed_val)
# torch.manual_seed(seed_val)
# if torch.cuda.is_available():
#     torch.cuda.manual_seed_all(seed_val)


class Embedder:

    def __init__(self):
        from transformers import BertTokenizer, BertModel

        pretrained_model = "klue/bert-base"

        self.tokenizer = BertTokenizer.from_pretrained(pretrained_model)

        added_target_word_tokens = {"additional_special_tokens": ["[TGT]", "[/TGT]"]}
        self.tokenizer.add_special_tokens(added_target_word_tokens)

        self.model = BertModel.from_pretrained(pretrained_model)
        self.model.resize_token_embeddings(len(self.tokenizer), mean_resizing=False)
        self.model.eval()

        self.token_limit = 512

    def _get_input_subinterval_indices_for_embedding(
        self, tgt_start_index: int, tgt_end_index: int, num_tokens: int
    ) -> Tuple[int, int]:
        print("LEN IS ", num_tokens)

        tgt_interval_len = tgt_end_index - tgt_start_index + 1

        num_surrounding_context_tokens = self.token_limit - 2 - tgt_interval_len

        # 2 tokens are additionally required for start and end
        num_left_context_tokens = num_surrounding_context_tokens // 2
        num_right_context_tokens = (
            num_surrounding_context_tokens - num_left_context_tokens
        )

        total_interval_start = max(0, tgt_start_index - num_left_context_tokens)
        total_interval_end = min(num_tokens, tgt_end_index + num_right_context_tokens)

        total_length = total_interval_end - total_interval_start
        # if one of them was stopped by the interval boundary of [0, tgt_start_index)
        if total_length < self.token_limit - 2:
            remaining_token_allowance = self.token_limit - total_length - 2

            left_buffer_length = total_interval_start  # - 0
            right_buffer_length = num_tokens - total_interval_end

            total_interval_start = max(
                0,
                total_interval_start
                - min(left_buffer_length, remaining_token_allowance),
            )
            remaining_after_left = remaining_token_allowance - (
                total_interval_start - total_interval_start
            )
            total_interval_end = min(
                num_tokens,
                total_interval_end + min(right_buffer_length, remaining_after_left),
            )

        print(total_interval_start, total_interval_end)
        return (total_interval_start, total_interval_end)

    def get_embedding_from_tgt_marked_text(self, text: str):

        inputs = self.tokenizer(
            text, return_tensors="pt", add_special_tokens=True, truncation=False
        )
        input_ids = inputs["input_ids"][0]

        tgt_start_id = self.tokenizer.convert_tokens_to_ids("[TGT]")
        tgt_end_id = self.tokenizer.convert_tokens_to_ids("[/TGT]")

        try:
            tgt_start_index = (input_ids == tgt_start_id).nonzero().item() + 1
            tgt_end_index = (input_ids == tgt_end_id).nonzero().item()
        except (IndexError, ValueError):
            raise ValueError("[TGT] and [/TGT] not present in tgt marked text")

        input_subset_indices = (0, len(input_ids))

        print(input_subset_indices)

        if len(input_ids) > self.token_limit:
            print("Truncating tokens;")
            input_subset_indices = self._get_input_subinterval_indices_for_embedding(
                tgt_start_index, tgt_end_index, len(input_ids)
            )
            inputs = {
                "input_ids": input_ids[
                    input_subset_indices[0] : input_subset_indices[1]
                ].unsqueeze(0),
                "attention_mask": inputs["attention_mask"][0][
                    input_subset_indices[0] : input_subset_indices[1]
                ].unsqueeze(0),
            }

        with torch.no_grad():
            outputs = self.model(**inputs)

        hidden_states = outputs.last_hidden_state[0]
        tagged_embeddings = hidden_states[tgt_start_index:tgt_end_index]

        return torch.mean(tagged_embeddings, dim=0)

    def get_all_embeddings_for_known_usages(
        self, known_usages: List[List[str]]
    ) -> List[List[torch.Tensor]]:
        return [
            [
                self.get_embedding_from_tgt_marked_text(known_usage_text)
                for known_usage_text in set_of_usages
            ]
            for set_of_usages in known_usages
        ]

    def get_average_token_embedding(self, text: str) -> torch.Tensor:

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
        )

        with torch.no_grad():
            embeddings = self.model(**inputs)

        last_hidden_state = embeddings.last_hidden_state

        mask = inputs["attention_mask"].unsqueeze(-1)

        weighted_embeddings = last_hidden_state * mask

        sum_embeddings = weighted_embeddings.sum(dim=1)
        sum_weights = mask.sum(dim=1)

        return sum_embeddings / sum_weights

    def get_average_token_embeddings_for_headword_sense_definitions(
        self, known_headwords: List[KnownHeadwordInformation]
    ) -> List[List[torch.Tensor]]:
        return [
            [
                self.get_average_token_embedding(known_sense["definition"])
                for known_sense in headword["known_senses"]
            ]
            for headword in known_headwords
        ]

    def _get_embeddings_for_known_usages(
        self, known_usages: List[str]
    ) -> List[torch.Tensor]:

        if len(known_usages) == 0:
            return []

        return [
            self.get_embedding_from_tgt_marked_text(known_usage)
            for known_usage in known_usages
        ]

    def get_lemma_embeddings_for_headword_sense_known_usages(
        self, known_headwords: List[KnownHeadwordInformation]
    ) -> List[List[List[torch.Tensor]]]:
        return [
            [
                self._get_embeddings_for_known_usages(known_sense["known_usages"])
                for known_sense in headword["known_senses"]
            ]
            for headword in known_headwords
        ]
