from typing import List
from dataclasses import dataclass

LEMMA_AMBIGUOUS = -1
NO_KNOWN_HEADWORDS = -2
LEMMA_IGNORED = -3
LEMMA_ALREADY_DISAMBIGUATED = -4


@dataclass
class KnownSenseInformation:
    definition: str
    known_usages: List[str]


@dataclass(frozen=True)
class KnownHeadwordInformation:
    known_senses: List[KnownSenseInformation]
