import {
  isArrayOf,
  isNumber,
  isObject,
  isString,
  isTypeOrNull,
} from "../../guardUtils";
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

interface BaseExampleType {
  id: number;
  /*word_ref: number;*/
  source: string;
}

export interface UserImageExampleType extends BaseExampleType {
  image_url: string;
  image_accompanying_text?: string;
}

export interface UserVideoExampleType extends BaseExampleType {
  video_id: string;
  start: number;
  end: number;
  video_text?: string;
}

export interface UserExampleSentenceType extends BaseExampleType {
  sentence: string;
}

export type UserExamplesType = {
  user_example_sentences: UserExampleSentenceType[] | null;
  user_video_examples: UserVideoExampleType[] | null;
  user_image_examples: UserImageExampleType[] | null;
  derived_example_lemmas: DerivedExampleLemmaType[] | null;
};

export interface DetailedKoreanType extends BaseKoreanWordType {
  word_type: string;
  history_info: HistoryInfoType | null;
  senses: DetailedSenseType[];
  user_examples: UserExamplesType | null;
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
  if (value === null) return true;

  return (
    isObject(value) &&
    isString(value.desc) &&
    isString(value.word_form) &&
    isString(value.allomorph) &&
    Array.isArray(value.history_sense_info) &&
    value.history_sense_info.length === 1 &&
    isHistorySenseInfoItem(value.history_sense_info[0]) &&
    (value.remark === undefined || isString(value.remark))
  );
}

function isBaseExampleType(value: unknown): value is BaseExampleType {
  return isObject(value) && isNumber(value.id) && isString(value.source);
}

export function isUserImageExampleType(
  value: unknown
): value is UserImageExampleType {
  if (!isBaseExampleType(value)) return false;

  const cast = value as UserImageExampleType;

  return (
    isString(cast.image_url) &&
    isTypeOrNull(cast.image_accompanying_text, isString)
  );
}

export function isUserVideoExampleType(
  value: unknown
): value is UserVideoExampleType {
  if (!isBaseExampleType(value)) return false;

  const cast = value as UserVideoExampleType;

  return (
    isString(cast.video_id) &&
    isTypeOrNull(cast.video_text, isString) &&
    isNumber(cast.start) &&
    isNumber(cast.end)
  );
}

export function isUserExampleSentenceType(
  value: unknown
): value is UserExampleSentenceType {
  if (!isBaseExampleType(value)) return false;

  const cast = value as UserExampleSentenceType;

  return isString(cast.sentence);
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

export function isUserExamplesType(value: unknown): value is UserExamplesType {
  if (value === null) return true;

  return (
    isObject(value) &&
    isArrayOf(value.derived_example_lemmas, isDerivedExampleLemmaType) &&
    isArrayOf(value.user_example_sentences, isUserExampleSentenceType) &&
    isArrayOf(value.user_image_examples, isUserImageExampleType) &&
    isArrayOf(value.user_video_examples, isUserVideoExampleType)
  );
}

export function isDetailedKoreanType(
  value: unknown
): value is DetailedKoreanType {
  const base = isObject(value) && isBaseKoreanWordType(value);

  if (!base) return false;

  const cast = value as DetailedKoreanType;

  return (
    isString(cast.word_type) &&
    isHistoryInfoType(cast.history_info) &&
    isArrayOf(cast.senses, isDetailedSenseType) &&
    isUserExamplesType(cast.user_examples)
  );
}
