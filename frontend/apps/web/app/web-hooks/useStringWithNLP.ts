export const useStringWithNLP = ({
  string,
  embedExamples,
}: {
  string: string;
  embedExamples: boolean;
}) => {
  /**
   * Extracts sentences from a string, where a sentence is a string followed by a period.
   * The periods terminating each sentence are not included in the returned array.
   *
   * @param string The string from which to extract sentences.
   * @returns An array of the sentences.
   */
  const getSentences = (string: string): string[] => {
    /* gets rid of periods; 
       getSentences('this. is a string.) === ['this', 'is a string'] */
    return string.split(/\.\s*/).filter((s) => s.length > 0);
  };

  /**
   * Extracts words from a sentence, where a word is a whitespace-delimited substring of `sentence`.
   *
   * @param sentence The sentence from which to extract words.
   * @returns An array of the words.
   */
  const getWords = (sentence: string, embedExamples: boolean): string[] => {
    if (!embedExamples) {
      const words = sentence.split(/\s/g);
      if (!words) return [];
      return words;
    }

    /* if there are examples, then an example is considered a single word
       even if it is a phrase that really consists of several words. */
    const splitAlongCurly = sentence.split(/({.*?})/g);
    let words = [];

    for (let i = 0; i < splitAlongCurly.length; i++) {
      if (splitAlongCurly[i].match(/{.*}/)) {
        words.push(splitAlongCurly[i]);
      } else {
        for (const word of splitAlongCurly[i].split(/\s/g)) {
          words.push(word);
        }
      }
    }

    return words.filter((word) => word.length > 0);
  };

  /**
   * Returns an array of array of sentences paired with their constituent words.
   *
   * @param string The string to from which to extract sentences and words.
   * @returns The array of arrays.
   */
  const getSentencesWithWords = (
    string: string,
    embedExamples: boolean
  ): [string, string[]][] => {
    return getSentences(string).map((sentence) => [
      sentence,
      getWords(sentence, embedExamples),
    ]);
  };

  return {
    sentencesWithWords: getSentencesWithWords(string, embedExamples),
  };
};
