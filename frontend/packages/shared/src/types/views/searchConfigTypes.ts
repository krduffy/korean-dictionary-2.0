export type SearchBarConfig =
  | { dictionary: "korean"; config: KoreanSearchConfig }
  | { dictionary: "hanja"; config: HanjaSearchConfig };

export interface BaseSearchConfig {
  search_term: string;
  page: number;
}

export type SearchConfig =
  | KoreanSearchConfig
  | HanjaSearchConfig
  | HanjaExamplesSearchConfig;

export type SearchConfigDictionary = "korean" | "hanja";

/* KOREAN SEARCH CONFIG */

export type AllowedKoreanSearchType = "word_exact" | "definition_contains";
export interface KoreanSearchConfig extends BaseSearchConfig {
  search_type: AllowedKoreanSearchType;
}

/* HANJA SEARCH CONFIG */

export type OperandPrefix = "eq" | "gt" | "gte" | "lt" | "lte" | "not";
export type GradeLevel = "중학교" | "고등학교" | "미배정";
enum examsLevels {
  "8급",
  "준7급",
  "7급",
  "준6급",
  "6급",
  "준5급",
  "5급",
  "준4급",
  "4급",
  "준3급",
  "3급",
  "준2급",
  "2급",
  "준1급",
  "1급",
  "준특급",
  "특급",
  "미배정",
}
export type ExamLevel = keyof typeof examsLevels;

export interface StrokeNumberConfig {
  operand: OperandPrefix;
  strokes: number;
}
export interface GradeLevelConfig {
  operand: OperandPrefix;
  level: GradeLevel;
}
export interface ExamLevelConfig {
  operand: OperandPrefix;
  level: ExamLevel;
}
export interface HanjaSearchConfig extends BaseSearchConfig {
  decomposition?: string;
  radical?: string;
  strokes?: StrokeNumberConfig;
  grade_level?: GradeLevelConfig;
  exam_level?: ExamLevelConfig;
}

export interface HanjaExamplesSearchConfig {
  page: number;
}
