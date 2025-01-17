from typing import List
from dataclasses import dataclass

UNSURE = -1
NO_KNOWN_HEADWORDS = -2


@dataclass
class KnownSenseInformation:
    definition: str
    known_usages: List[str]


@dataclass(frozen=True)
class KnownHeadwordInformation:
    known_senses: List[KnownSenseInformation]
