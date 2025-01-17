import re


def tag_first_curly_with_tgt(example: str) -> str:

    pattern = r"\{(.*)?\}"
    replacer = re.compile(pattern)

    replaced = replacer.sub(r"[TGT]\1[/TGT]", example)

    # saw a change
    if example != replaced:
        return replaced

    print(example)
    raise ValueError("`example` does not have a substring enclosed in { }.")


def tag_index_with_tgt(text: str, index_of_tgt: int) -> str:

    individual_tokens = text.split(" ")

    with_replaced = [
        "[TGT]" + token + "[/TGT]" if i == index_of_tgt else token
        for i, token in enumerate(individual_tokens)
    ]

    return " ".join(with_replaced)
