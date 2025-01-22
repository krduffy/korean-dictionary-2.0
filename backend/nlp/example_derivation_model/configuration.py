# Number of examples a sense must have to be considered a candidate for its
# associated headword. In the dataset, examples are a proxy for frequency;
# ie, if a word has a lot of examples of its usage it is probably because
# it is used a lot. Setting num required examples even to 1 eliminates a huge
# number of senses, so I do it to prevent the embedder from having to waste time
# on very unlikely headwords. It can also prevent embeddings from needing to happen
# at all because if there is only one headword found after this condition is applied
# then it defaults to just returning that only headword
NUM_REQUIRED_EXAMPLES = 1

MAX_EXAMPLES_ON_SENSE = 5

SUBTEXT_TARGET_CHARACTER_LENGTH = 50

USE_CUDA = True

DEFINITION_WEIGHT = 0.25
EXAMPLE_WEIGHT = 0.75

ACCEPTANCE_MIN_SCORE = 0.3
ACCEPTANCE_MIN_DELTA = 0.1

LEMMA_BATCH_SIZE = 50


def average(nums):
    return sum(nums) / len(nums)


single_senses_examples_similarity_flattener = average
all_senses_examples_similarity_flattener = max
single_senses_definitions_similarity_flattener = average
