import { splitAlongHangul } from "../koreanLangUtils";

describe("koreanLangUtils", () => {
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
