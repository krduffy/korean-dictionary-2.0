import { isArrayOf, isNumber, isObject, isString } from "../../guardUtils";
import {
  DetailedSenseType,
  isDetailedSenseType,
  isSimplifiedSenseType,
  SimplifiedSenseType,
} from "./senseDictionaryItems";
import { isUserData } from "./sharedTypes";

export type UserDataType = {
  is_known: boolean;
  is_studied: boolean;
};

export type BaseKoreanWordType = {
  target_code: number;
  word: string;
  origin: string;
  user_data: UserDataType | null;
  result_ranking: 0 | 1 | 2 | 3;
};

export interface KoreanSearchResultType extends BaseKoreanWordType {
  word_type: string;
  senses: SimplifiedSenseType[];
}

export type HistoryCenturyExampleType = {
  source: string;
  example: string;
  origin?: string;
};

export type HistoryCenturyInfoType = {
  history_example_info?: HistoryCenturyExampleType[];
  century: string;
  mark: string;
};

export type HistorySenseInfoItem = {
  history_century_info: HistoryCenturyInfoType[];
};

export type HistoryInfoType = {
  desc: string;
  allomorph: string;
  // no idea why this is an array in the base data
  history_sense_info: [HistorySenseInfoItem];
  remark?: string;
  word_form: string;
};

export interface DerivedExampleLemmaType {
  source_text_preview: string;
  lemma: string;
  source: string;
  source_text_pk: number;
  eojeol_number_in_source_text: number;
}

export interface DetailedKoreanType extends BaseKoreanWordType {
  word_type: string;
  history_info: HistoryInfoType | null;
  senses: DetailedSenseType[];
  derived_example_lemmas: DerivedExampleLemmaType[];
}

/* Guards */

export function isBaseKoreanWordType(
  value: unknown
): value is BaseKoreanWordType {
  return (
    isObject(value) &&
    isNumber(value.target_code) &&
    isNumber(value.result_ranking) &&
    value.result_ranking >= 0 &&
    value.result_ranking <= 3 &&
    isString(value.word) &&
    isString(value.origin) &&
    (value.user_data === null || isUserData(value.user_data))
  );
}

export function isKoreanSearchResultType(
  value: unknown
): value is KoreanSearchResultType {
  return (
    isObject(value) &&
    isBaseKoreanWordType(value) &&
    isString((value as KoreanSearchResultType).word_type) &&
    isArrayOf((value as KoreanSearchResultType).senses, isSimplifiedSenseType)
  );
}

export function isHistoryCenturyExampleType(
  value: unknown
): value is HistoryCenturyExampleType {
  const x =
    isObject(value) &&
    isString(value.source) &&
    isString(value.example) &&
    (value.origin === undefined || isString(value.origin));

  return x;
}

export function isDerivedExampleLemmaType(
  value: unknown
): value is DerivedExampleLemmaType {
  return (
    isObject(value) &&
    isString(value.source_text_preview) &&
    isString(value.lemma) &&
    isString(value.source) &&
    isNumber(value.source_text_pk) &&
    isNumber(value.eojeol_number_in_source_text)
  );
}

export function isHistoryCenturyInfo(
  value: unknown
): value is HistoryCenturyInfoType {
  const x =
    isObject(value) &&
    isArrayOf(value.history_example_info, isHistoryCenturyExampleType) &&
    isString(value.century) &&
    isString(value.mark);
  return x;
}

export function isHistorySenseInfoItem(
  value: unknown
): value is HistorySenseInfoItem {
  const x =
    isObject(value) &&
    isArrayOf(value.history_century_info, isHistoryCenturyInfo);

  return x;
}

export function isHistoryInfoType(value: unknown): value is HistoryInfoType {
  const x =
    isObject(value) &&
    isString(value.desc) &&
    isString(value.word_form) &&
    isString(value.allomorph) &&
    Array.isArray(value.history_sense_info) &&
    value.history_sense_info.length === 1 &&
    isHistorySenseInfoItem(value.history_sense_info[0]) &&
    (value.remark === undefined || isString(value.remark));

  return x;
}

export function isDetailedKoreanType(
  value: unknown
): value is DetailedKoreanType {
  const base = isObject(value) && isBaseKoreanWordType(value);

  if (!base) return false;

  const cast = value as DetailedKoreanType;

  return (
    isString(cast.word_type) &&
    (cast.history_info === null || isHistoryInfoType(cast.history_info)) &&
    isArrayOf(cast.senses, isDetailedSenseType) &&
    (cast.derived_example_lemmas === null ||
      isArrayOf(cast.derived_example_lemmas, isDerivedExampleLemmaType))
  );
}
