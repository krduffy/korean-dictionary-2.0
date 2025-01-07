from typing import List
from dataclasses import dataclass


@dataclass
class KnownSenseInformation:
    definition: str
    known_usages: List[str]


@dataclass(frozen=True)
class KnownHeadwordInformation:
    known_senses: List[KnownSenseInformation]
