import sys
from unittest.mock import MagicMock

sys.modules["konlpy"] = MagicMock()
sys.modules["konlpy.tag"] = MagicMock()
