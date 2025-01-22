import re
from typing import List


def tag_first_curly_with_tgt(example: str) -> str:

    pattern = r"\{(.*)?\}"
    replacer = re.compile(pattern)

    replaced = replacer.sub(r"[TGT]\1[/TGT]", example)

    # saw a change
    if example != replaced:
        return replaced

    # print(example)
    raise ValueError("`example` does not have a substring enclosed in { }.")


def tag_indices_with_tgt(text: str, indices_of_tgts: List[int]) -> List[str]:

    # TODO Will removing newlines impact results?
    individual_tokens = text.split()

    returned_strings = []

    for index_of_tgt in indices_of_tgts:
        with_replaced = " ".join(
            [
                "[TGT]" + token + "[/TGT]" if i == index_of_tgt else token
                for i, token in enumerate(individual_tokens)
            ]
        )
        returned_strings.append(with_replaced)

    return returned_strings
