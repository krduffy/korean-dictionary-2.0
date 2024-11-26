export type UserDataType = {
  is_known: boolean;
  is_studied: boolean;
};

export type BaseSenseType = {
  target_code: number;
  order: number;
  definition: string;
  pos: string;
  type: string;
  category: string;
};

export type SimplifiedSenseType = BaseSenseType;

export type BaseKoreanWordType = {
  target_code: number;
  word: string;
  origin: string;
  user_data: UserDataType | null;
};

export interface KoreanSearchResultType extends BaseKoreanWordType {
  word_type: string;
  senses: SimplifiedSenseType[];
}

export type RegionInfoType = {
  region: string;
};

export type ExampleType = {
  example: string;
  source?: string;
  translation?: string;
  origin?: string;
  region?: string;
};

export type RelationType = {
  link_target_code?: number;
  word: string;
  type: string;
};

export type NormType = {
  desc: string;
  role: string;
  type: string;
};

export type GrammarItemType = {
  grammar: string;
};

export type PatternType = {
  pattern: string;
};

export type ProverbType = {
  definition: string;
  link_target_code?: number;
  word: string;
  type: string;
};

export type HistoryCenturyExampleType = {
  source: string;
  example: string;
  origin?: string;
};

export type HistoryCenturyInfoType = {
  history_example_info?: HistoryCenturyExampleType[];
  century: number;
  mark: string;
};

export type HistorySenseInfoItem = {
  history_century_info: HistoryCenturyInfoType;
};

export type HistoryInfoType = {
  desc: string;
  allomorph: string;
  history_sense_info: HistorySenseInfoItem[];
  remark?: string;
  word_form: string;
};

export interface DetailedKoreanType extends BaseKoreanWordType {
  word_type: string;
  history_info: HistoryInfoType | null;
  senses: DetailedSenseType[];
}

export interface MeaningReadings {
  meaning: string;
  readings: string[];
}

export interface BaseHanjaType {
  character: string;
  user_data: UserDataType | null;
  meaning_readings: MeaningReadings[];
}

export interface HanjaSearchResultType extends BaseHanjaType {
  strokes: number;
  grade_level: string;
  exam_level: string;
  explanation: string;
}

export interface SenseAdditionalInfoType {
  proverb_info?: ProverbType[];
  pattern_info?: PatternType[];
  grammar_info?: GrammarItemType[];
  norm_info?: NormType[];
  relation_info?: RelationType[];
  example_info?: ExampleType[];
  region_info?: RegionInfoType[];
}

export interface SenseProverbInfoType {}

export interface DetailedSenseType extends BaseSenseType {
  additional_info: SenseAdditionalInfoType;
}

export interface DetailedHanjaType extends BaseHanjaType {
  strokes: number;
  grade_level: string;
  exam_level: string;
  explanation: string;
  decomposition: string;
  radical: string;
  radical_source: string;
}

export type KoreanWordInHanjaPopupType = BaseKoreanWordType;

export interface HanjaPopupType extends BaseHanjaType {
  word_data: KoreanWordInHanjaPopupType[];
}
