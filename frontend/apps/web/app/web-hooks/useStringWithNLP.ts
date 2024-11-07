export const useStringWithNLP = ({ string }: { string: string }) => {
  /**
   * Extracts sentences from a string, where a sentence is a string followed by a period.
   * The periods terminating each sentence are not included in the returned array.
   *
   * @param string The string from which to extract sentences.
   * @returns An array of the sentences.
   */
  const getSentences = (string: string): string[] => {
    return string.split(/(?<=\.)\s+/);
  };

  /**
   * Extracts words from a sentence, where a word is a whitespace-delimited substring of `sentence`.
   *
   * @param sentence The sentence from which to extract words.
   * @returns An array of the words.
   */
  const getWords = (sentence: string): string[] => {
    const words = sentence.split(/\s/g);
    if (!words) return [];
    return words;
  };

  /**
   * Returns an array of array of sentences paired with their constituent words.
   *
   * @param string The string to from which to extract sentences and words.
   * @returns The array of arrays.
   */
  const getSentencesWithWords = (string: string): [string, string[]][] => {
    return getSentences(string).map((sentence) => [
      sentence,
      getWords(sentence),
    ]);
  };

  return {
    sentencesWithWords: getSentencesWithWords(string),
  };
};
