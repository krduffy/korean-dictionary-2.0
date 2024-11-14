import { NLPToken } from "src/types/koreanLangTypes";
import { splitAlongHangul } from "../utils/koreanLangUtils";

export const useStringWithNLP = ({
  string,
  embedExamples,
}: {
  string: string;
  embedExamples: boolean;
}) => {
  /**
   * Extracts sentences from a string, where a sentence is ended by a ., !, or ? followed by
   * one or more whitespaces (or end of string).
   *
   * @param string The string from which to extract sentences.
   * @returns An array of the sentences.
   */
  const getSentences = (string: string): string[] => {
    /* splits along !, ?, . while keeping those in the sentences. */
    return string.split(/(?<=[.?!])\s+/g).filter((s) => s.length > 0);
  };

  const getSplitAlongHangul = (str: string): NLPToken[] =>
    splitAlongHangul(str).map((tokenData) => {
      return {
        token: tokenData.token,
        type: tokenData.isHangul ? "hangul" : "other",
      };
    });

  /**
   * Extracts tokens from a sentence, where a token is a substring of `sentence` that may or may
   * not be a word. A word is a string of hangul characters. It is always true that the concatenation
   * of all of the tokens extracted === the original sentence. If `embedExamples` is true, any strings
   * within one sentence surrounded by { } will be treated as a single non-word token.
   *
   * @param sentence The sentence from which to extract words.
   * @param embedExamples Whether the sentence should be considered to have examples.
   * @returns An array of objects with tokens and whether they are words or not.
   */
  const getTokens = (sentence: string, embedExamples: boolean): NLPToken[] => {
    if (sentence.length < 1) {
      return [];
    }

    if (!embedExamples) {
      return getSplitAlongHangul(sentence);
    }

    /* if there are examples, then an example is considered a single word
       even if it is a phrase that really consists of several words. */
    return (
      sentence
        // split along { }, including the { } in relevant substrings so they can be marked as examples
        .split(/({.*})/g)
        .filter((substr) => substr.length > 0)
        .flatMap((substr) => {
          if (substr.startsWith("{") && substr.endsWith("}"))
            return [
              {
                token: substr.substring(1, substr.length - 1),
                type: "example",
              },
            ] as NLPToken[];
          return getSplitAlongHangul(substr) as NLPToken[];
        })
    );
  };

  /**
   * Returns an array of array of sentences paired with their constituent words.
   * Examples are surrounded by { }.
   *
   * @param string The string to from which to extract sentences and words.
   * @param embedExamples Whether the string should be considered to have examples.
   * @returns The array of arrays.
   */
  const getSentencesWithTokens = (
    string: string,
    embedExamples: boolean
  ): [string, NLPToken[]][] => {
    return getSentences(string).map((sentence) => [
      // getting rid of { }; replacing with whatever is inside
      embedExamples ? sentence.replaceAll(/{(.*)}/g, "$1") : sentence,
      getTokens(sentence, embedExamples),
    ]);
  };

  return {
    sentencesWithTokens: getSentencesWithTokens(string, embedExamples),
  };
};
