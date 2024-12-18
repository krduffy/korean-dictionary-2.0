import { isArrayOf, isNumber, isObject, isString } from "../../guardUtils";
import {
  BaseKoreanWordType,
  isBaseKoreanWordType,
} from "./koreanDictionaryItems";
import { isUserData, UserDataType } from "./sharedTypes";

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

export interface DetailedHanjaType extends BaseHanjaType {
  strokes: number;
  grade_level: string;
  exam_level: string;
  explanation: string;
  decomposition: string | null;
  radical: string;
  radical_source: string;
}

export type KoreanWordInHanjaPopupType = BaseKoreanWordType;

export interface HanjaPopupType extends BaseHanjaType {
  word_results: KoreanWordInHanjaPopupType[];
}

export type SenseInKoreanExampleType = {
  target_code: number;
  definition: string;
};

export interface KoreanWordInHanjaExamplesType extends BaseKoreanWordType {
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

export function isKoreanWordInHanjaPopupType(
  value: unknown
): value is KoreanWordInHanjaPopupType {
  return isBaseKoreanWordType(value);
}

export function isHanjaPopupDataType(value: unknown): value is HanjaPopupType {
  return (
    isObject(value) &&
    isBaseHanjaType(value) &&
    isArrayOf(value.word_results, isKoreanWordInHanjaPopupType)
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
    isString(value.radical_source)
  );
}

export function isSenseInKoreanExampleType(
  value: unknown
): value is SenseInKoreanExampleType {
  return (
    isObject(value) && isNumber(value.target_code) && isString(value.definition)
  );
}

export function isHanjaExampleKoreanWordType(
  value: unknown
): value is KoreanWordInHanjaExamplesType {
  return (
    isBaseKoreanWordType(value) &&
    isSenseInKoreanExampleType(
      (value as KoreanWordInHanjaExamplesType).first_sense
    )
  );
}
