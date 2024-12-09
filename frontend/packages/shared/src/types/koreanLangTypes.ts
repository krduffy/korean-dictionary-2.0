export type NLPTokenType = "hangul" | "example" | "other";

export type NLPToken = {
  token: string;
  /** "hangul", "example", or "other". */
  type: NLPTokenType;
};

export type SyllableBlockType = "C" | "V" | "CV" | "CVC" | "N";
export type KeyboardConversionToken = [SyllableBlockType, string[]];
