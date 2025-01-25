# Lemmas that are very frequent and in general waste the time of the
# algorithm and the user. They are not worth adding since they are
# already full of examples anyway and most people would know them
# within a few days of learning. In some cases like 우리, there are
# legimitately multiple headwords that necessitate disambiguation
# but from testing, the model will almost never pick the
# nonproform/nondeterminer/otherwise less common meaning anyways
# Completely refusing to do anything with them is better

# I will continue to add to this. There will likely be 100+ when all is said
# and done

# ! It may be worthwhile to force all lemmas of len 1 and an ambiguous set of
# headwords to by default be banned. words like 주, 분, 전, ... which are not
# "stop words" which most of the ones below could probably be called

# 두번이상 나오는 단어도 있음
# + 목록이 아직 정밀하지는 않음
# ** 사전자체는 이해력이 중급~고급 이어야 쓸수있기때문에
# 이 단어들을 모르면 사전 쓰지도 않았을 것.
# 자연어처리 모델이 아무리 빨라도 단어수가 굉장히 높다보니까
# 수를 싹 잘라야됨

skipped_lemmas = """
  저 나 너 당신 우리 그 이 저 수 지 데 때 리 터 의
  소리 적 한 번 다 전 만 등 조금 좀 위 뒤 아래 색 비 불 물 풀
  곳 더 덜 중 무 화 또 속 시 분 곧 성
  다리 손 목 발 
  이다 아니다 하다 지다 보다 위하다 의하다 있다 없다 먹다 따르다 받다 가다 되다
  나다 내다 거리다 듣다 말하다 들리다 말다 아니하다 않다 싶다 타다 차다 치다
  버리다
""".split()

skipped_lemmas_set = set(skipped_lemmas)
