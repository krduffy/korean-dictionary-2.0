export interface UserData {
  is_known: boolean;
  is_studied: boolean;
}

export interface BaseSenseType {
  target_code: number;
  order: number;
  definition: string;
  pos: string;
  type: string;
  category: string;
}

export type SimplifiedSenseType = BaseSenseType;

export interface BaseKoreanWordType {
  target_code: number;
  word: string;
  origin: string;
  user_data: UserData | null;
}

export interface KoreanSearchResultType extends BaseKoreanWordType {
  word_type: string;
  senses: [SimplifiedSenseType];
}

export interface RegionInfoType {
  region: string;
}

export interface ExampleType {
  example: string;
  source: string;
  translation?: string;
  origin?: string;
  region?: string;
}

export interface RelationInfoType {
  link_target_code: string;
  word: string;
  type: string;
}

export interface NormInfoType {
  desc: string;
  role: string;
  type: string;
}

export interface GrammarInfoType {
  grammar: string;
}

export interface PatternInfoType {
  pattern: string;
}

export interface ProverbInfoType {
  definition: string;
  link: string;
  link_target_code: string;
  word: string;
  type: string;
}

export interface HistoryInfoType {
  desc: string;
  word_info: string;
  allomorph: string;
  history_sense_info: string;
  remark: string;
}

export interface DetailedKoreanType extends BaseKoreanWordType {
  word_type: string;
  history_info: HistoryInfoType | null;
  senses: [DetailedSenseType];
}

interface MeaningReadings {
  meaning: string;
  readings: string;
}

interface BaseHanjaType {
  character: string;
  user_data: UserData | null;
  meaning_readings: [MeaningReadings];
}

export interface HanjaSearchResultType extends BaseHanjaType {
  strokes: number;
  grade_level: string;
  exam_level: string;
  explanation: string;
}

export interface SenseAdditionalInfoType {
  proverb_info?: ProverbInfoType;
  pattern_info?: PatternInfoType;
  grammar_info?: GrammarInfoType;
  norm_info?: NormInfoType;
  relation_info?: RegionInfoType;
  example_info?: ExampleType[];
  region_info?: RegionInfoType;
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
