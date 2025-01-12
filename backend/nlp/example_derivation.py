from django.core.files.uploadedfile import InMemoryUploadedFile


def derive_examples(in_memory_file: InMemoryUploadedFile):

    in_memory_file.open(mode="rb")

    for i, bytes in enumerate(in_memory_file.chunks()):
        text = bytes.decode("utf-8")
        print(f"text {i} is {text}")


def chunk_text(filename: str):

    # trying to preserve general paragraph boundaries but also
    # no chunk can be too long (512 tokens) due to kobert restraints.
    # having chunks be too small is also not ideal because then there is
    # too little context surrounding lemma usages to make headword assumptions

    with open(filename, mode="r", encoding="utf-8") as file:
        next_paragraph = file.readlines(hint=512)
        yield next_paragraph
