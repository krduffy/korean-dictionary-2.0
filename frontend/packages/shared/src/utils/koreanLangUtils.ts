/**
 * Splits a string along lines of consecutive hangul blocks (not jamo or compatability jamo).
 *
 * For example,
 * testString("이런 사람은 '열사(烈士)'라고 하죠.") will return
 * [{ '이런', true}, {' ', false}, {'사람은', true}, {' \'', false}, {'열사', true},
 * {'(烈士)\'', false}, {'라고', true}, {' ', false}, {'하죠', true}, {'.', false}].
 *
 * @param str The string to split.
 * @returns An array of tokens paired with whether they are hangul or not.
 */
export const splitAlongHangul = (
  str: string
): { token: string; isHangul: boolean }[] | [] => {
  if (str.length < 1) {
    return [];
  }

  const FIRST_HANGUL = "\uac00".charCodeAt(0);
  const LAST_HANGUL = "\ud7a3".charCodeAt(0);

  return str
    .split(/([\uac00-\ud7a3]+)/g)
    .filter((substr) => substr.length > 0)
    .map((substr) => {
      const firstCharCode = substr.charCodeAt(0);

      return {
        token: substr,
        isHangul: firstCharCode >= FIRST_HANGUL && firstCharCode <= LAST_HANGUL,
      };
    });
};

export const isConsonant = (str: string) => {
  if (str.length !== 1) {
    return false;
  }
  return "ㅂㅈㄷㄱㅅㅁㄴㅇㄹㅎㅋㅌㅊㅍㅃㅉㄸㄲㅆ".includes(str);
};

export const isVowel = (str: string) => {
  if (str.length !== 1) {
    return false;
  }
  return "ㅛㅕㅑㅐㅔㅗㅓㅏㅣㅠㅜㅡㅖㅒ".includes(str);
};

/**
 * Returns "는", "은", or "" based on the final character in `string`. If it is hangul, 는 or 은
 * is returned accordingly. Compatability jamo return 는 if they are vowels (ㅏ, ㅓ, ...) or 은 if
 * they are consonants (ㅈ, ㄱ, ...). All other strings return "".
 *
 * @param string The string for which to get a topic marker.
 * @returns The topic marker for the string.
 */
export const getTopicMarker = (string: string): "은" | "는" | "" => {
  /*  
      This can seem magic-numbery, but for those interested in how to convert a unicode in the 
      Korean Syllables unicode block to its constituent jamo, see the Wikipedia article below.
      https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode

      From the article,
      "
        Pre-composed hangul syllables in the Unicode hangul syllables block are algorithmically 
        defined with the following formula:
        [(initial) × 588 + (medial) × 28 + (final)] + 44032
      "

      Therefore the goal of this algorithm is to determine if `final` in the above equation is not 0
      (the syllable ends in a consonant sound).

      Returns '은' if string ends in batchim, final consonant or '는' if it ends in a vowel sound
      If the input does not end in a Korean syllable, returns ''
    */

  if (string.length < 1) return "";

  const lastChar = string.charAt(string.length - 1);

  if (isConsonant(lastChar)) {
    return "은";
  } else if (isVowel(lastChar)) {
    return "는";
  }

  const charCode = lastChar.charCodeAt(0);

  const FIRST_SYLLABLE = 0xac00;
  const LAST_SYLLABLE = 0xd7a3;

  if (charCode < FIRST_SYLLABLE || charCode > LAST_SYLLABLE) {
    return "";
  }

  if (((charCode - 44032) % 588) % 28 !== 0) {
    return "은";
  }

  return "는";
};

/**
 * Returns a string with 만 inserted to make the number shorter.
 *
 * @param number A number. Should satisfy 0 <= `number` < 10**8.
 * @returns A stringified form of the number.
 */
export const longNumberToFormatted = (number: number): string => {
  /* String.prototype.toLocaleString("ko-KR") does not do what I want.
     I specifically want no commas and only for 만 to be inserted where appropriate */

  const tenthousands = Math.floor(number / 10000);

  if (tenthousands === 0) {
    return number.toString();
  }

  const remainder = number - tenthousands * 10000;

  if (remainder === 0) {
    return `${tenthousands}만`;
  }

  return `${tenthousands}만${remainder}`;
};
