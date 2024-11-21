import { engKeyboardToKorean } from "../keyboardConverter";

describe("Testing engKeyboardToKorean", () => {
  const testMappings = [
    { input: "zlfjs", expectedOutput: "키런" },
    { input: "ekfrrhk th", expectedOutput: "닭과 소" },
    { input: "dlqfurdj", expectedOutput: "입력어" },
    { input: "_ek", expectedOutput: "_다" },
    { input: "EkRkTk", expectedOutput: "따까싸" },
    { input: "gksrmf", expectedOutput: "한글" },
    { input: "rsetns", expectedOutput: "ㄱㄴㄷ순" },
    { input: "agwllrmmlmkn", expectedOutput: "ㅁㅎ지ㅣ그ㅢㅡㅏㅜ" },
    { input: "ekfrt", expectedOutput: "닭ㅅ" },
    {
      // a definition (sense) for 어학
      input:
        "dhlrnrdjfmf dusrngkrjsk tmqemrgkrl dnlgks gkrans. Ehsms rmfjs gkrrhk(學科).",
      expectedOutput:
        "외국어를 연구하거나 습득하기 위한 학문. 또는 그런 학과(學科).",
    },
    {
      /* all of these lines end in whitespace */
      input: `gksrmf Ehsms whtjsrmfdms gksrnrdjdml rhdtlr answkfhtj, tpwhddl gksrnrdjfmf vyrlgkrl 
      dnlgkdu ckdwpgks answkdls 'gnsalswjddma'(訓民正音)dmf 
      20tprl chqks dlgn ekffl dlfmsms audclddlek. 
      gksrmfdlfks dlfmadms wntlrud tjstodrhk rnrdjdusrngkrghl ghldnjsemfdp dmlgo 
      wldjwls rjtdmfh dkffuwu dlTdmau rm Emtdms 
      'dmEmadl ehlsms zmsrmf', 'dhwlr gkskQnsdls zmsrmf', 
      'gksrnrdlsdml rmfwk'dlek. gksrmfdml Eh ekfms qufclddmfhsms 
      wjddma(正音), djsans(諺文), djstj(諺書), qkswjf(反切), 
      dkazmf, dkgotrmf, rkrirmf, rnrans(國文) emddl dlTek.`,
      expectedOutput: `한글 또는 조선글은 한국어의 공식 문자로서, 세종이 한국어를 표기하기 
      위하여 창제한 문자인 '훈민정음'(訓民正音)을 
      20세기 초반 이후 달리 이르는 명칭이다. 
      한글이란 이름은 주시경 선생과 국어연구학회 회원들에 의해 
      지어진 것으로 알려져 있으며 그 뜻은 
      '으뜸이 되는 큰글', '오직 하나뿐인 큰글', 
      '한국인의 글자'이다. 한글의 또 다른 별칭으로는 
      정음(正音), 언문(諺文), 언서(諺書), 반절(反切), 
      암클, 아햇글, 가갸글, 국문(國文) 등이 있다.`,
    },
  ];

  test.each(testMappings)(
    "input $input gives output $expectedOutput",
    ({ input, expectedOutput }) => {
      expect(engKeyboardToKorean(input)).toBe(expectedOutput);
    }
  );
});
