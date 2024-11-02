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

const isConsonant = (jamo: string) => {
  return "ㅂㅈㄷㄱㅅㅁㄴㅇㄹㅎㅋㅌㅊㅍㅃㅉㄸㄲㅆ".includes(jamo);
};

const isVowel = (jamo: string) => {
  return "ㅛㅕㅑㅐㅔㅗㅓㅏㅣㅠㅜㅡㅖㅒ".includes(jamo);
};
