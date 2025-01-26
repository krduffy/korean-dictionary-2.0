import { isArrayOf, isNumber, isObject, isString } from "../../guardUtils";
import {
  BaseKoreanHeadwordType,
  isBaseKoreanHeadwordType,
} from "./koreanDictionaryItems";
import { isUserData, UserDataType } from "./sharedTypes";

export interface MeaningReadings {
  meaning: string;
  readings: string[];
}

export type HanjaResultRankingType =
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16;

export interface BaseHanjaType {
  character: string;
  user_data: UserDataType | null;
  meaning_readings: MeaningReadings[];
  result_ranking: HanjaResultRankingType;
}

export interface HanjaSearchResultType extends BaseHanjaType {
  strokes: number;
  grade_level: string;
  exam_level: string;
  explanation: string;
}

export interface DetailedHanjaType extends BaseHanjaType {
  strokes: number;
  grade_level: string;
  exam_level: string;
  explanation: string;
  decomposition: string | null;
  radical: string;
  radical_source: "namuwiki" | "makemeahanzi";
}

export type KoreanHeadwordInHanjaPopupType = BaseKoreanHeadwordType;

export interface HanjaPopupType extends BaseHanjaType {
  word_results: KoreanHeadwordInHanjaPopupType[];
}

export type SenseInKoreanExampleType = {
  target_code: number;
  definition: string;
};

export interface KoreanHeadwordInHanjaExamplesType
  extends BaseKoreanHeadwordType {
  first_sense: SenseInKoreanExampleType;
}

/* Guards */
export function isMeaningReadingsItem(
  value: unknown
): value is MeaningReadings {
  return (
    isObject(value) &&
    isString(value.meaning) &&
    isArrayOf(value.readings, isString)
  );
}

export function isBaseHanjaType(value: unknown): value is BaseHanjaType {
  return (
    isObject(value) &&
    isString(value.character) &&
    isNumber(value.result_ranking) &&
    value.result_ranking >= -1 &&
    value.result_ranking <= 16 &&
    (value.user_data === null || isUserData(value.user_data)) &&
    isArrayOf(value.meaning_readings, isMeaningReadingsItem)
  );
}

export function isHanjaSearchResultType(
  value: unknown
): value is HanjaSearchResultType {
  return (
    isObject(value) &&
    isBaseHanjaType(value) &&
    isNumber(value.strokes) &&
    isString(value.grade_level) &&
    isString(value.exam_level) &&
    isString(value.explanation)
  );
}

export function isKoreanHeadwordInHanjaPopupType(
  value: unknown
): value is KoreanHeadwordInHanjaPopupType {
  return isBaseKoreanHeadwordType(value);
}

export function isHanjaPopupDataType(value: unknown): value is HanjaPopupType {
  return (
    isObject(value) &&
    isBaseHanjaType(value) &&
    isArrayOf(value.word_results, isKoreanHeadwordInHanjaPopupType)
  );
}

export function isDetailedHanjaType(
  value: unknown
): value is DetailedHanjaType {
  return (
    isObject(value) &&
    isBaseHanjaType(value) &&
    isNumber(value.strokes) &&
    isString(value.grade_level) &&
    isString(value.exam_level) &&
    isString(value.explanation) &&
    (value.decomposition === null || isString(value.decomposition)) &&
    isString(value.radical) &&
    (value.radical_source === "makemeahanzi" ||
      value.radical_source === "namuwiki")
  );
}

export function isSenseInKoreanExampleType(
  value: unknown
): value is SenseInKoreanExampleType {
  return (
    isObject(value) && isNumber(value.target_code) && isString(value.definition)
  );
}

export function isHanjaExampleKoreanHeadwordType(
  value: unknown
): value is KoreanHeadwordInHanjaExamplesType {
  return (
    isBaseKoreanHeadwordType(value) &&
    isSenseInKoreanExampleType(
      (value as KoreanHeadwordInHanjaExamplesType).first_sense
    )
  );
}
