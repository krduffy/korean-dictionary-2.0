from django.test import TestCase
from nlp.korean_lang_utils import 교착


class 교착Tests(TestCase):
    """어미들을 다 교착해 후보 활용어를 만들어주는 함부 테스트"""

    def test_먹었습니다(self):
        후보_활용어들 = 교착("먹", ["었", "습니다"])
        반환_후보 = ["먹었습니다"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_저었을까(self):
        후보_활용어들 = 교착("젓", ["었", "을까"])
        반환_후보 = ["젓었을까", "저었을까", "저어었을까"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_주웠더니(self):
        후보_활용어들 = 교착("줍", ["었", "더니"])
        반환_후보 = ["줍었더니", "주웠더니", "주우었더니"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_걸어가지고(self):
        후보_활용어들 = 교착("걷", ["어", "가지", "고"])
        반환_후보 = ["걷어가지고", "걸어가지고"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_후려쳐서(self):
        후보_활용어들 = 교착("후리", ["어", "치", "어서"])
        반환_후보 = ["후려쳐서", "후리어쳐서", "후려치어서", "후리어치어서"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_몰랐다니까(self):
        후보_활용어들 = 교착("모르", ["았", "다니까"])
        반환_후보 = ["모르았다니까", "모랐다니까", "몰라았다니까", "몰랐다니까"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_치렀다(self):
        후보_활용어들 = 교착("치르", ["었", "다"])
        반환_후보 = ["치렀다", "치르었다", "칠러었다", "칠렀다"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_아는데(self):
        후보_활용어들 = 교착("알", ["는데"])
        반환_후보 = ["알는데", "아는데"]
        self.assertCountEqual(후보_활용어들, 반환_후보)

    def test_따라서(self):
        후보_활용어들 = 교착("따르", ["아서"])
        반환_후보 = ["딸라서", "딸라아서", "따르아서", "따라서"]
        self.assertCountEqual(후보_활용어들, 반환_후보)
