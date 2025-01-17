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

banned_lemmas = set(
    [
        # 주로는 대명사
        "저",
        "나",
        "당신",
        "우리",
        # 주로는 관형사
        "그",
        "이",
        "저",
        # 주로는 의존명사
        "수",
        # 용언/의존용언
        "이다",
        "하다",
        "지다",
        "보다",
        "의하다",
        "있다",
        "없다",
    ]
)
