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
주로는_대명사 = """저 나 당신 우리""".split(" ")
주로는_관형사 = """그 이 저""".split(" ")
주로는_의존명사 = """수 지 데""".split(" ")
용언 = """이다 하다 지다 보다 의하다 있다 없다""".split(" ")

금지_단어 = 주로는_대명사 + 주로는_관형사 + 주로는_의존명사 + 용언

banned_lemmas = set(금지_단어)
