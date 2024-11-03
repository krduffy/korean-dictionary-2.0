export type View = KoreanSearchView | HanjaSearchView;

export interface KoreanSearchView {
  searchConfig: SearchConfig;
  type: "korean_search";
  data: KoreanSearchConfig;
}

export interface HanjaSearchView {
  searchConfig: SearchConfig;
  type: "hanja_search";
  data: HanjaSearchConfig;
}

export type ViewType = "korean_search" | "hanja_search";

export interface UsePanelArgs {
  initialView: View;
  initialSearchConfig: SearchConfig;
}

export interface UsePanelReturns {
  searchConfigSetters: SearchConfigSetters;
  // eslint-disable-next-line no-unused-vars
  submitSearch: (e: React.FormEvent) => void;
}

export type SearchConfigDictionary = "korean" | "hanja";

export type SearchConfig =
  | { dictionary: "korean"; config: KoreanSearchConfig }
  | { dictionary: "hanja"; config: HanjaSearchConfig };

export type AllowedKoreanSearchType = "word_exact" | "definition_contains";
export interface KoreanSearchConfig extends BaseSearchConfig {
  search_type: AllowedKoreanSearchType;
}

export type OperandPrefix = "eq" | "gt" | "gte" | "lt" | "lte" | "not";
export type GradeLevel = "중학교" | "고등학교" | "미배정";
export type ExamLevel =
  | "8급"
  | "준7급"
  | "7급"
  | "준6급"
  | "6급"
  | "준5급"
  | "5급"
  | "준4급"
  | "4급"
  | "준3급"
  | "3급"
  | "준2급"
  | "2급"
  | "준1급"
  | "1급"
  | "준특급"
  | "특급"
  | "미배정";
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

export interface BaseSearchConfig {
  search_term: string;
}
export interface HanjaSearchConfig extends BaseSearchConfig {
  decomposition?: string;
  radical?: string;
  strokes?: StrokeNumberConfig;
  grade_level?: GradeLevelConfig;
  exam_level?: ExamLevelConfig;
}

export interface UseSearchSubmitterArgs {
  // eslint-disable-next-line no-unused-vars
  setView: (view: View) => void;
  searchConfig: SearchConfig;
}

export interface SearchConfigSetters {
  // eslint-disable-next-line no-unused-vars
  setSearchTerm: (searchTerm: string) => void;
  switchDictionary: () => void;
  // eslint-disable-next-line no-unused-vars
  setKoreanSearchType: (searchType: AllowedKoreanSearchType) => void;
}

export interface UseSearchConfigSettersReturns {
  searchConfigSetters: SearchConfigSetters;
}

export interface UseSearchConfigSettersArgs {
  searchConfig: SearchConfig;
  // eslint-disable-next-line no-unused-vars
  setSearchConfig: (sc: SearchConfig) => void;
}
