from typing import List
from transformers import BertTokenizer, BertModel
import torch

from nlp.nlp_types import KnownHeadwordInformation

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

        pretrained_model = "klue/bert-base"

        self.tokenizer = BertTokenizer.from_pretrained(pretrained_model)

        added_target_word_tokens = {"additional_special_tokens": ["[TGT]", "[/TGT]"]}
        self.tokenizer.add_special_tokens(added_target_word_tokens)

        self.model = BertModel.from_pretrained(pretrained_model)
        self.model.resize_token_embeddings(len(self.tokenizer), mean_resizing=False)
        self.model.eval()

    def get_embedding_from_tgt_marked_text(self, text: str) -> torch.Tensor:
        inputs = self.tokenizer(text, return_tensors="pt", add_special_tokens=True)
        # TODO need to handle the case in which the number of tokens is too large
        # also potentially pass in the tokens/find some way to not have to do
        # the tokenization step for every single iteration of the lemmas in the
        # input text
        tokens = self.tokenizer.tokenize(text)

        with torch.no_grad():
            outputs = self.model(**inputs)

        start_idx = tokens.index("[TGT]") + 1
        end_idx = tokens.index("[/TGT]")

        hidden_states = outputs.last_hidden_state[0]
        tagged_embeddings = hidden_states[start_idx:end_idx]

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

        # TODO handle case of too many tokens!!
        inputs = self.tokenizer(
            text, return_tensors="pt", padding=True, truncation=True
        )
        print(inputs)

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
