# Number of examples a sense must have to be considered a candidate for its
# associated headword
NUM_REQUIRED_EXAMPLES = 1

MAX_EXAMPLES_ON_SENSE = 5

SUBTEXT_TARGET_CHARACTER_LENGTH = 100

USE_CUDA = True

DEFINITION_WEIGHT = 0.25
EXAMPLE_WEIGHT = 0.75

ACCEPTANCE_MIN_SCORE = 0.3
ACCEPTANCE_MIN_DELTA = 0.1


def average(nums):
    return sum(nums) / len(nums)


single_senses_examples_similarity_flattener = average
all_senses_examples_similarity_flattener = max
single_senses_definitions_similarity_flattener = average
