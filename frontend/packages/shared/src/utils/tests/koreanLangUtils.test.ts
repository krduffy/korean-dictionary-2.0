import {
  splitAlongHangul,
  longNumberToFormatted,
  getTopicMarker,
} from "../koreanLangUtils";

describe("koreanLangUtils", () => {
  describe("splitAlongHangul", () => {
    const testData = [
      {
        string: "이런 사람은 '열사(烈士)'라고 하죠.",
        expected: [
          { token: "이런", isHangul: true },
          { token: " ", isHangul: false },
          { token: "사람은", isHangul: true },
          { token: " '", isHangul: false },
          { token: "열사", isHangul: true },
          { token: "(烈士)'", isHangul: false },
          { token: "라고", isHangul: true },
          { token: " ", isHangul: false },
          { token: "하죠", isHangul: true },
          { token: ".", isHangul: false },
        ],
      },
    ];

    test.each(testData)(
      "$string returns the correct tokens",
      ({ string, expected }) => {
        expect(splitAlongHangul(string)).toEqual(expected);
      }
    );
  });

  describe("longNumberToShorter", () => {
    const testData = [
      { input: 111, expectedOutput: "111" },
      { input: 10000, expectedOutput: "1만" },
      { input: 100000, expectedOutput: "10만" },
      { input: 1234567, expectedOutput: "123만4567" },
      { input: 0, expectedOutput: "0" },
      { input: 9999, expectedOutput: "9999" },
      { input: 10001, expectedOutput: "1만1" },
    ];

    test.each(testData)(
      "input $input returns $expectedOutput",
      ({ input, expectedOutput }) => {
        expect(longNumberToFormatted(input)).toBe(expectedOutput);
      }
    );
  });
});

describe("getTopicMarker", () => {
  const testData = [
    { input: "키런", expectedOutput: "은" },
    { input: "다", expectedOutput: "는" },
    { input: "거", expectedOutput: "는" },
    { input: "꿰", expectedOutput: "는" },
    { input: "킭", expectedOutput: "은" },
    { input: "죽", expectedOutput: "은" },
    { input: "ㅈ", expectedOutput: "은" },
    { input: "ㅏ", expectedOutput: "는" },
    { input: "notkorean", expectedOutput: "" },
  ];

  test.each(testData)(
    "input $input has the output $expectedOutput",
    ({ input, expectedOutput }) => {
      expect(getTopicMarker(input)).toBe(expectedOutput);
    }
  );
});
