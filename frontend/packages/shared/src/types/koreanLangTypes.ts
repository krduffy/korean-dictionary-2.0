export type NLPTokenType = "hangul" | "example" | "other";

export type NLPToken = {
  token: string;
  /** "hangul", "example", or "other". */
  type: NLPTokenType;
};

enum monophtongs {
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅛ",
  "ㅜ",
  "ㅠ",
  "ㅡ",
  "ㅣ",
}

enum diphtongs {
  "ㅢ",
  "ㅝ",
  "ㅚ",
  "ㅙ",
  "ㅟ",
  "ㅘ",
  "ㅞ",
}

enum consonants {
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
}

enum initialConsonants {
  "ㅉ",
  "ㄸ",
  "ㅃ",
}

enum finalConsonants {
  "ㄳ",
  "ㄵ",
  "ㄶ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅄ",
}

export type KoreanConsonant =
  | keyof typeof consonants
  | keyof typeof initialConsonants
  | keyof typeof finalConsonants;

export type InitialKoreanConsonant =
  | keyof typeof consonants
  | keyof typeof initialConsonants;

export type FinalKoreanConsonant =
  | keyof typeof consonants
  | keyof typeof finalConsonants;

export function isInitialConsonant(str: string): str is InitialKoreanConsonant {
  return (
    Object.values(consonants).includes(str) &&
    Object.values(initialConsonants).includes(str)
  );
}

export function isFinalConsonant(str: string): str is FinalKoreanConsonant {
  return (
    Object.keys(consonants).includes(str) &&
    Object.keys(finalConsonants).includes(str)
  );
}

export function isVowel(str: string): str is KoreanVowel {
  return (
    Object.keys(monophtongs).includes(str) &&
    Object.keys(diphtongs).includes(str)
  );
}

export type KoreanMonophthong = keyof typeof monophtongs;
export type KoreanDiphthong = keyof typeof diphtongs;

export type KoreanVowel = KoreanMonophthong | KoreanDiphthong;

export type JamoType = KoreanConsonant | KoreanVowel;

export type SyllableBlockType = "C" | "V" | "CV" | "CVC" | "N";
export type KeyboardConversionToken = [SyllableBlockType, string[]];

enum choseong {
  "ᄀ",
  "ᄁ",
  "ᄂ",
  "ᄃ",
  "ᄄ",
  "ᄅ",
  "ᄆ",
  "ᄇ",
  "ᄈ",
  "ᄉ",
  "ᄊ",
  "ᄋ",
  "ᄌ",
  "ᄍ",
  "ᄎ",
  "ᄏ",
  "ᄐ",
  "ᄑ",
  "ᄒ",
}

enum jungseong {
  "ᅡ",
  "ᅢ",
  "ᅣ",
  "ᅤ",
  "ᅥ",
  "ᅦ",
  "ᅧ",
  "ᅨ",
  "ᅩ",
  "ᅪ",
  "ᅫ",
  "ᅬ",
  "ᅭ",
  "ᅮ",
  "ᅯ",
  "ᅰ",
  "ᅱ",
  "ᅲ",
  "ᅳ",
  "ᅴ",
  "ᅵ",
}

enum jongseong {
  "ᆨ",
  "ᆩ",
  "ᆪ",
  "ᆫ",
  "ᆬ",
  "ᆭ",
  "ᆮ",
  "ᆯ",
  "ᆰ",
  "ᆱ",
  "ᆲ",
  "ᆳ",
  "ᆴ",
  "ᆵ",
  "ᆶ",
  "ᆷ",
  "ᆸ",
  "ᆹ",
  "ᆺ",
  "ᆻ",
  "ᆼ",
  "ᆽ",
  "ᆾ",
  "ᆿ",
  "ᇀ",
  "ᇁ",
  "ᇂ",
}

export type KoreanChoseong = keyof typeof choseong;

export type KoreanJungseong = keyof typeof jungseong;

export type KoreanJongseong = keyof typeof jongseong;
