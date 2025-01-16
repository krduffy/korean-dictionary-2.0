/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useStringWithNLP } from "../useStringWithNLP";
import { NLPTokenType } from "../../types/koreanLangTypes";

const getReturnedToken = (token: string, type: NLPTokenType) => {
  return { token: token, type: type };
};

// normal
const string1 = "말을 하는 버릇이나 본새.";
const string1Expected = [
  [
    string1,
    [
      getReturnedToken("말을", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("하는", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("버릇이나", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("본새", "hangul"),
      getReturnedToken(".", "other"),
    ],
  ],
];

// more than one sentence
const string2 = "먹지 아니하다? 좋지 못하다! 춥지 않다.";
const string2Expected = [
  [
    "먹지 아니하다?",
    [
      getReturnedToken("먹지", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("아니하다", "hangul"),
      getReturnedToken("?", "other"),
    ],
  ],
  [
    "좋지 못하다!",
    [
      getReturnedToken("좋지", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("못하다", "hangul"),
      getReturnedToken("!", "other"),
    ],
  ],
  [
    "춥지 않다.",
    [
      getReturnedToken("춥지", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("않다", "hangul"),
      getReturnedToken(".", "other"),
    ],
  ],
];

// examples with { }
const string3 = "문을 {부수는} 거로 하자.";
const string3Expected = [
  [
    "문을 부수는 거로 하자.",
    [
      getReturnedToken("문을", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("부수는", "example"),
      getReturnedToken(" ", "other"),
      getReturnedToken("거로", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("하자", "hangul"),
      getReturnedToken(".", "other"),
    ],
  ],
];

// examples embedded, but no { }
const string4 = "문을 부수는 거로 하자.";
const string4Expected = [
  [
    "문을 부수는 거로 하자.",
    [
      getReturnedToken("문을", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("부수는", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("거로", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("하자", "hangul"),
      getReturnedToken(".", "other"),
    ],
  ],
];

// example with more than one word as part of the example
const string5 = "{이장님 이름}. 안 보여.";
const string5Expected = [
  [
    "이장님 이름.",
    [
      getReturnedToken("이장님 이름", "example"),
      getReturnedToken(".", "other"),
    ],
  ],
  [
    "안 보여.",
    [
      getReturnedToken("안", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("보여", "hangul"),
      getReturnedToken(".", "other"),
    ],
  ],
];

// non sentence terminating periods ??
/* Likely not that consequential + will complicate a lot so add this later if needed */

const string6 = "중국 춘추 시대의 사상가ㆍ학자(B.C.551~B.C.479).";
const string6Expected = [
  [
    string6,
    [
      getReturnedToken("중국", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("춘추", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("시대의", "hangul"),
      getReturnedToken(" ", "other"),
      getReturnedToken("사상가", "hangul"),
      getReturnedToken("ㆍ", "other"),
      getReturnedToken("학자", "hangul"),
      // periods other than the last are not followed by whitespace so they do not terminate
      // the sentence.
      getReturnedToken("(B.C.551~B.C.479).", "other"),
    ],
  ],
];

// add exclamation

describe("useStringWithNLP", () => {
  const testData = [
    { string: string1, expected: string1Expected, embedExamples: false },
    { string: string2, expected: string2Expected, embedExamples: false },
    { string: string3, expected: string3Expected, embedExamples: true },
    { string: string4, expected: string4Expected, embedExamples: true },
    { string: string5, expected: string5Expected, embedExamples: true },
    { string: string6, expected: string6Expected, embedExamples: false },
  ];

  test.each(testData)(
    "$string returns the expected tokens",
    ({ string, expected, embedExamples }) => {
      const { result } = renderHook(() =>
        useStringWithNLP({
          string: string,
          embedExamples: embedExamples,
        })
      );

      expect(result.current.sentencesWithTokens).toEqual(expected);
    }
  );
});
