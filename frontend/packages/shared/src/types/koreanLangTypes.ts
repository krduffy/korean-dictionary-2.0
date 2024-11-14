export type NLPTokenType = "hangul" | "example" | "other";

export type NLPToken = {
  token: string;
  /** "hangul", "example", or "other". */
  type: NLPTokenType;
};
