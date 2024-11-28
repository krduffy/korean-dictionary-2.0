import {
  FinalKoreanConsonant,
  KeyboardConversionToken,
  KoreanVowel,
} from "../types/koreanLangTypes";
import { isConsonant, isVowel } from "./koreanLangUtils";

const consonantOrVowel = (char: string) => {
  if (isConsonant(char)) {
    return "C";
  }
  if (isVowel(char)) {
    return "V";
  }
  return "N"; //neither
};

const toSyllable = (
  choseong: string,
  jungseong: string,
  jongseong?: string
) => {
  /* Magic numbery; see above for explanation */
  const choseongNum = choseong.charCodeAt(0) - 0x1100;
  const jungseongNum = jungseong.charCodeAt(0) - 0x1161;
  /* 0x11a7 instead of 11a8 to account for 0 possible */
  const jongseongNum = jongseong ? jongseong.charCodeAt(0) - 0x11a7 : 0;

  return String.fromCharCode(
    choseongNum * 588 + jungseongNum * 28 + jongseongNum + 44032
  );
};

const toChoseong = (compatabilityConsonant: string): string => {
  switch (compatabilityConsonant) {
    case "ㄱ":
      return "ᄀ";
    case "ㄲ":
      return "ᄁ";
    case "ㄴ":
      return "ᄂ";
    case "ㄷ":
      return "ᄃ";
    case "ㄸ":
      return "ᄄ";
    case "ㄹ":
      return "ᄅ";
    case "ㅁ":
      return "ᄆ";
    case "ㅂ":
      return "ᄇ";
    case "ㅃ":
      return "ᄈ";
    case "ㅅ":
      return "ᄉ";
    case "ㅆ":
      return "ᄊ";
    case "ㅇ":
      return "ᄋ";
    case "ㅈ":
      return "ᄌ";
    case "ㅉ":
      return "ᄍ";
    case "ㅊ":
      return "ᄎ";
    case "ㅋ":
      return "ᄏ";
    case "ㅌ":
      return "ᄐ";
    case "ㅍ":
      return "ᄑ";
    case "ㅎ":
      return "ᄒ";
    default:
      return compatabilityConsonant;
  }
};

const toJungseong = (compatibilityVowel: string): string => {
  switch (compatibilityVowel) {
    case "ㅏ":
      return "ᅡ";
    case "ㅐ":
      return "ᅢ";
    case "ㅑ":
      return "ᅣ";
    case "ㅒ":
      return "ᅤ";
    case "ㅓ":
      return "ᅥ";
    case "ㅔ":
      return "ᅦ";
    case "ㅕ":
      return "ᅧ";
    case "ㅖ":
      return "ᅨ";
    case "ㅗ":
      return "ᅩ";
    case "ㅘ":
      return "ᅪ";
    case "ㅙ":
      return "ᅫ";
    case "ㅚ":
      return "ᅬ";
    case "ㅛ":
      return "ᅭ";
    case "ㅜ":
      return "ᅮ";
    case "ㅝ":
      return "ᅯ";
    case "ㅞ":
      return "ᅰ";
    case "ㅟ":
      return "ᅱ";
    case "ㅠ":
      return "ᅲ";
    case "ㅡ":
      return "ᅳ";
    case "ㅢ":
      return "ᅴ";
    case "ㅣ":
      return "ᅵ";
    default:
      return compatibilityVowel;
  }
};

const toJongseong = (compatibilityJongseong: string): string => {
  switch (compatibilityJongseong) {
    case "ㄱ":
      return "ᆨ";
    case "ㄲ":
      return "ᆩ";
    case "ㄳ":
      return "ᆪ";
    case "ㄴ":
      return "ᆫ";
    case "ㄵ":
      return "ᆬ";
    case "ㄶ":
      return "ᆭ";
    case "ㄷ":
      return "ᆮ";
    case "ㄹ":
      return "ᆯ";
    case "ㄺ":
      return "ᆰ";
    case "ㄻ":
      return "ᆱ";
    case "ㄼ":
      return "ᆲ";
    case "ㄽ":
      return "ᆳ";
    case "ㄾ":
      return "ᆴ";
    case "ㄿ":
      return "ᆵ";
    case "ㅀ":
      return "ᆶ";
    case "ㅁ":
      return "ᆷ";
    case "ㅂ":
      return "ᆸ";
    case "ㅄ":
      return "ᆹ";
    case "ㅅ":
      return "ᆺ";
    case "ㅆ":
      return "ᆻ";
    case "ㅇ":
      return "ᆼ";
    case "ㅈ":
      return "ᆽ";
    case "ㅊ":
      return "ᆾ";
    case "ㅋ":
      return "ᆿ";
    case "ㅌ":
      return "ᇀ";
    case "ㅍ":
      return "ᇁ";
    case "ㅎ":
      return "ᇂ";
    default:
      return compatibilityJongseong;
  }
};

const mergeJungseong = (v1: string, v2: string): KoreanVowel | null => {
  if (v1 === "ㅗ") {
    if (v2 === "ㅏ") return "ㅘ";
    if (v2 === "ㅐ") return "ㅙ";
    if (v2 === "ㅣ") return "ㅚ";
  } else if (v1 === "ㅜ") {
    if (v2 === "ㅓ") return "ㅝ";
    if (v2 === "ㅔ") return "ㅞ";
    if (v2 === "ㅣ") return "ㅟ";
  } else if (v1 === "ㅡ") {
    if (v2 === "ㅣ") return "ㅢ";
  }

  return null;
};

const mergeJongseong = (
  c1: string,
  c2: string
): FinalKoreanConsonant | null => {
  if (c1 === "ㄱ") {
    if (c2 === "ㅅ") return "ㄳ";
  } else if (c1 === "ㄴ") {
    if (c2 === "ㅈ") return "ㄵ";
    if (c2 === "ㅎ") return "ㄶ";
  } else if (c1 === "ㄹ") {
    if (c2 === "ㄱ") return "ㄺ";
    if (c2 === "ㅁ") return "ㄻ";
    if (c2 === "ㅂ") return "ㄼ";
    if (c2 === "ㅅ") return "ㄽ";
    if (c2 === "ㅌ") return "ㄾ";
    if (c2 === "ㅍ") return "ㄿ";
    if (c2 === "ㅎ") return "ㅀ";
  } else if (c1 === "ㅂ") {
    if (c2 === "ㅅ") return "ㅄ";
  }

  return null;
};

const arrayToSyllable = (array: string[]) => {
  if (array.length <= 1) {
    return array[0];
  } else if (array.length == 2 && array[0] && array[1]) {
    const syllable = toSyllable(toChoseong(array[0]), toJungseong(array[1]));

    return syllable;
  } else if (array.length == 3 && array[0] && array[1] && array[2]) {
    const syllable = toSyllable(
      toChoseong(array[0]),
      toJungseong(array[1]),
      toJongseong(array[2])
    );

    return syllable;
  }
  console.error("Array to syllable: array unexpectedly long: " + array);
  return array.join("");
};

/* Returns what a key on the english keyboard maps to on the korean keyboard, or
   `key` if `key` does not map to a different key on the korean keyboard. */
const engKeyToKoreanKey = (key: string) => {
  const caseMatters = ["Q", "W", "E", "R", "T", "O", "P"];
  if (!caseMatters.includes(key)) {
    key = key.toLowerCase();
  }

  switch (key) {
    case "q":
      return "ㅂ";
    case "Q":
      return "ㅃ";
    case "w":
      return "ㅈ";
    case "W":
      return "ㅉ";
    case "e":
      return "ㄷ";
    case "E":
      return "ㄸ";
    case "r":
      return "ㄱ";
    case "R":
      return "ㄲ";
    case "t":
      return "ㅅ";
    case "T":
      return "ㅆ";
    case "y":
      return "ㅛ";
    case "u":
      return "ㅕ";
    case "i":
      return "ㅑ";
    case "o":
      return "ㅐ";
    case "O":
      return "ㅒ";
    case "p":
      return "ㅔ";
    case "P":
      return "ㅖ";
    case "a":
      return "ㅁ";
    case "s":
      return "ㄴ";
    case "d":
      return "ㅇ";
    case "f":
      return "ㄹ";
    case "g":
      return "ㅎ";
    case "h":
      return "ㅗ";
    case "j":
      return "ㅓ";
    case "k":
      return "ㅏ";
    case "l":
      return "ㅣ";
    case "z":
      return "ㅋ";
    case "x":
      return "ㅌ";
    case "c":
      return "ㅊ";
    case "v":
      return "ㅍ";
    case "b":
      return "ㅠ";
    case "n":
      return "ㅜ";
    case "m":
      return "ㅡ";
  }
  return key;
};

/**
 * Remaps any english character in a string to its corresponding letter on the korean keyboard and
 * combines any combinable jamo in the resulting remapping.
 *
 * For example,
 * engKeyboardToKorean("gksrnrdj") === "한국어".
 *
 * @param string - The string to remap.
 * @returns The remapped string.
 */
export const engKeyboardToKorean = (string: string): string => {
  /* Returns what a string of characters from the english keyboard would be if the user
     instead used the korean keyboard.

     For example,
        engKeyboardToKorean("gksrnrdj") = "한국어"
        engKeyboardToKorean("줄rl") = "줄기"
    */

  if (string.length < 1) {
    return "";
  }

  /* split every character into separate elem in array. */
  let tokens: KeyboardConversionToken[] = string.split("").map((char) => {
    const mappedChar = engKeyToKoreanKey(char);
    return [consonantOrVowel(mappedChar), [mappedChar]];
  }) as KeyboardConversionToken[];

  /*
   * Four passes through tokens can correctly combine jamo
   *
   * Pass 1 = combine consecutive vowels into one vowel if they can go together
   *          (ㅜ and ㅣ can, while ㅓ and ㅓ cannot, for example)
   * Pass 2 = combine consecutive consonant -> vowel into a single CV (consonant-vowel)
   * Pass 3 = combine consecutive consonants into one consonant if they can go together
   *          (ㅂ and ㅅ can, while ㄹ and ㅋ cannot, for example)
   * Pass 4 = combine consecutive CV -> consonant into one syllable block
   *
   * In the code, these passes are made backwards to prevent in place array splicing from
   * altering the iteration of the for loops
   *
   * Example of four passes
   * Initial list of jamo: [C, V, C, V, V, C, C]
   * -> [C, V, C, VV, C, C]
   * -> [CV, CVV, C, C]
   * -> [CV, CVV, CC]
   * -> [CV, CVVCC]
   * Done. This resultant word might be 지쥟 (not a real word)
   */

  /* Pass 1 */
  /* Combined vowels are still represented as V (not VV) despite being diphthongs */
  for (let i = tokens.length - 2; i >= 0; i--) {
    const token1 = tokens[i];
    const token2 = tokens[i + 1];

    if (
      token1?.[0] === "V" &&
      token2?.[0] === "V" &&
      token1[1][0] &&
      token2[1][0]
    ) {
      const mergedJungseong = mergeJungseong(token1[1][0], token2[1][0]);

      if (mergedJungseong !== null) {
        tokens.splice(i, 2, ["V", [mergedJungseong]]);
      }
    }
  }

  /* Pass 2 */
  for (let i = tokens.length - 2; i >= 0; i--) {
    const token1 = tokens[i];
    const token2 = tokens[i + 1];

    if (token1?.[0] === "C" && token2?.[0] === "V") {
      /* the filtering should never come into effect as actually deleting anything */
      const newChars = [token1[1]?.[0], token2[1]?.[0]].filter(
        (x) => x !== undefined
      );

      tokens.splice(i, 2, ["CV", newChars]);
    }
  }

  /* Pass 3 */
  /* 겹받침 written as C, not CC */
  for (let i = tokens.length - 2; i >= 0; i--) {
    const precedingToken = tokens[i - 1];
    const currentToken = tokens[i];
    const followingToken = tokens[i + 1];

    const checkForMerge =
      currentToken !== undefined &&
      currentToken[0] === "C" &&
      followingToken !== undefined &&
      followingToken[0] === "C";

    if (checkForMerge) {
      if (
        currentToken[1]?.[0] === undefined ||
        followingToken[1]?.[0] === undefined
      ) {
        continue;
      }

      /* below is to avoid a corner case with 3 consonants in a row,
         which could have the first and second OR second and third combined
         eg ㄹ ㄱ ㅅ */
      const precedingAndCurrentCanMerge = precedingToken?.[1]?.[0]
        ? Boolean(
            precedingToken &&
              mergeJongseong(precedingToken[1][0], currentToken[1][0])
          )
        : false;

      const currentAndFollowingMerged = mergeJongseong(
        currentToken[1][0],
        followingToken[1][0]
      );

      if (!precedingAndCurrentCanMerge && currentAndFollowingMerged !== null) {
        tokens.splice(i, 2, ["C", [currentAndFollowingMerged]]);
      }
    }
  }

  /* Pass 4 */
  for (let i = tokens.length - 2; i >= 0; i--) {
    const currentToken = tokens[i];
    const followingToken = tokens[i + 1];

    if (currentToken?.[0] === "CV" && followingToken?.[0] === "C") {
      const newChars = [
        currentToken[1][0],
        currentToken[1][1],
        followingToken[1][0],
      ].filter((x) => x !== undefined);

      tokens.splice(i, 2, ["CVC", newChars]);
    }
  }

  return tokens.map((token) => arrayToSyllable(token[1])).join("");
};
