import { splitAlongHangul, longNumberToShorter } from "../koreanLangUtils";

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
    const testData = {
      /* inputs and expected outputs */
      "111": "111",
      "10000": "1만",
      "100000": "10만",
      "1234567": "123만4567",
      "0": "0",
      "9999": "9999",
      "10001": "1만1",
    };

    test.each(Object.entries(testData))(
      "input %s returns %s",
      (input, expectedOutput) => {
        expect(longNumberToShorter(input)).toBe(expectedOutput);
      }
    );
  });
});
