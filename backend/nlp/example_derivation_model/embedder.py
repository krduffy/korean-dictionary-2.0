from typing import List, Tuple
import torch

from nlp.example_derivation_model.configuration import USE_CUDA


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

        self.tgt_start_id = self.tokenizer.convert_tokens_to_ids("[TGT]")
        self.tgt_end_id = self.tokenizer.convert_tokens_to_ids("[/TGT]")

        self.token_limit = 512

        if USE_CUDA and torch.cuda.is_available():
            self.model.to("cuda")

    def _get_input_subinterval_indices_for_embedding(
        self, tgt_start_index: int, tgt_end_index: int, num_tokens: int
    ) -> Tuple[int, int]:

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

        return (total_interval_start, total_interval_end)

    def _get_scoped_input_indices(self, input_ids) -> Tuple[int, int]:
        try:
            tgt_start_index = (input_ids == self.tgt_start_id).nonzero()[0][
                0
            ].item() + 1
            tgt_end_index = (input_ids == self.tgt_end_id).nonzero()[0][0].item()
        except (IndexError, ValueError):
            raise ValueError("[TGT] and [/TGT] not present in tgt marked text")

        input_subset_indices = (0, len(input_ids))

        if len(input_ids) > self.token_limit:
            input_subset_indices = self._get_input_subinterval_indices_for_embedding(
                tgt_start_index, tgt_end_index, len(input_ids)
            )

        return input_subset_indices

    def _get_inputs_for_tgt_marked_texts(self, texts: List[str]):

        input_ids_list, attention_masks, input_indices = [], [], []

        all_tokenized_inputs = self.tokenizer(
            texts,
            return_tensors="pt",
            add_special_tokens=True,
            truncation=False,
            padding=True,
        )

        for i in range(len(all_tokenized_inputs["input_ids"])):
            original_input_ids = all_tokenized_inputs["input_ids"][i]

            # the indices with [TGT] and [/TGT] inside
            scoped_indices = self._get_scoped_input_indices(original_input_ids)

            original_attention_mask = all_tokenized_inputs["attention_mask"][i]

            input_ids_list.append(
                original_input_ids[scoped_indices[0] : scoped_indices[1]]
            )
            attention_masks.append(
                original_attention_mask[scoped_indices[0] : scoped_indices[1]]
            )
            input_indices.append(scoped_indices)

        return (
            self.tokenizer.pad(
                {
                    "input_ids": input_ids_list,
                    "attention_mask": attention_masks,
                },
                return_tensors="pt",
            ),
            input_indices,
        )

    def get_embeddings_from_tgt_marked_texts(
        self, texts: List[str]
    ) -> List[torch.Tensor]:

        inputs, input_indices = self._get_inputs_for_tgt_marked_texts(texts)

        if USE_CUDA and torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)

        hidden_states = outputs.last_hidden_state

        result_embeddings = []
        for i, indices in enumerate(input_indices):
            tagged_embeddings = hidden_states[i][indices[0] : indices[1]]
            result_embeddings.append(torch.mean(tagged_embeddings, dim=0))

        return result_embeddings

    def _get_embeddings_for_known_usages(
        self, known_usages: List[str]
    ) -> List[torch.Tensor]:

        if len(known_usages) == 0:
            return []

        return [
            self.get_embedding_from_tgt_marked_text(known_usage)
            for known_usage in known_usages
        ]

    def get_average_token_embeddings(self, texts: List[str]) -> List[torch.Tensor]:

        inputs = self.tokenizer(
            texts, return_tensors="pt", padding=True, truncation=True
        )

        if USE_CUDA and torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}

        with torch.no_grad():
            embeddings = self.model(**inputs)

        last_hidden_state = embeddings.last_hidden_state
        mask = inputs["attention_mask"].unsqueeze(-1)

        weighted_embeddings = last_hidden_state * mask

        sum_embeddings = weighted_embeddings.sum(dim=1)
        sum_weights = mask.sum(dim=1)

        avg_embeddings = sum_embeddings / sum_weights

        return [avg_embedding for avg_embedding in avg_embeddings]
