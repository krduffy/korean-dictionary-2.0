import { isArrayOf, isNumber, isObject, isString } from "../../guardUtils";
import {
  DetailedSenseType,
  isDetailedSenseType,
  isSimplifiedSenseType,
  SimplifiedSenseType,
} from "./senseDictionaryItems";
import { isUserData } from "./sharedTypes";
import {
  isUserExampleSentenceType,
  isUserImageExampleType,
  isUserVideoExampleType,
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "./userExampleItems";

export type UserDataType = {
  is_known: boolean;
  is_studied: boolean;
};

export type BaseKoreanHeadwordType = {
  target_code: number;
  word: string;
  origin: string;
  user_data: UserDataType | null;
  result_ranking: 0 | 1 | 2 | 3;
};

export interface KoreanSearchResultType extends BaseKoreanHeadwordType {
  word_type: string;
  senses: SimplifiedSenseType[];
}

export type HistoryCenturyExampleType = {
  source?: string;
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
  allomorph?: string;
  /* History sense info is almost always length 1. I have only found '사랑'
     with a length of two otherwise */
  history_sense_info: HistorySenseInfoItem[];
  remark?: string;
  word_form?: string;
};

export type UserExamplesType = {
  user_example_sentences: UserExampleSentenceType[] | null;
  user_video_examples: UserVideoExampleType[] | null;
  user_image_examples: UserImageExampleType[] | null;
};

export interface DetailedKoreanType extends BaseKoreanHeadwordType {
  word_type: string;
  history_info: HistoryInfoType | null;
  senses: DetailedSenseType[];
  user_examples: UserExamplesType | null;
}

export type SenseInKoreanExampleType = {
  target_code: number;
  definition: string;
};

export interface KoreanHeadwordInExampleType extends BaseKoreanHeadwordType {
  first_sense: SenseInKoreanExampleType;
}

/* Guards */

export function isBaseKoreanHeadwordType(
  value: unknown
): value is BaseKoreanHeadwordType {
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
    isBaseKoreanHeadwordType(value) &&
    isString((value as KoreanSearchResultType).word_type) &&
    isArrayOf((value as KoreanSearchResultType).senses, isSimplifiedSenseType)
  );
}

export function isSenseInKoreanExampleType(
  value: unknown
): value is SenseInKoreanExampleType {
  return (
    isObject(value) && isNumber(value.target_code) && isString(value.definition)
  );
}

export function isKoreanHeadwordInExampleType(
  value: unknown
): value is KoreanHeadwordInExampleType {
  return (
    isBaseKoreanHeadwordType(value) &&
    isSenseInKoreanExampleType(
      (value as KoreanHeadwordInExampleType).first_sense
    )
  );
}

export function isHistoryCenturyExampleType(
  value: unknown
): value is HistoryCenturyExampleType {
  const x =
    isObject(value) &&
    (value.source === undefined || isString(value.source)) &&
    isString(value.example) &&
    (value.origin === undefined || isString(value.origin));

  return x;
}

export function isHistoryCenturyInfo(
  value: unknown
): value is HistoryCenturyInfoType {
  const x =
    isObject(value) &&
    (value.history_example_info === undefined ||
      isArrayOf(value.history_example_info, isHistoryCenturyExampleType)) &&
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
    (value.word_form === undefined || isString(value.word_form)) &&
    (value.allomorph === undefined || isString(value.allomorph)) &&
    isArrayOf(value.history_sense_info, isHistorySenseInfoItem) &&
    (value.remark === undefined || isString(value.remark))
  );
}

export function isUserExamplesType(value: unknown): value is UserExamplesType {
  if (value === null) return true;

  return (
    isObject(value) &&
    isArrayOf(value.user_example_sentences, isUserExampleSentenceType) &&
    isArrayOf(value.user_image_examples, isUserImageExampleType) &&
    isArrayOf(value.user_video_examples, isUserVideoExampleType)
  );
}

export function isDetailedKoreanType(
  value: unknown
): value is DetailedKoreanType {
  const base = isObject(value) && isBaseKoreanHeadwordType(value);

  if (!base) return false;

  const cast = value as DetailedKoreanType;

  return (
    isString(cast.word_type) &&
    isHistoryInfoType(cast.history_info) &&
    isArrayOf(cast.senses, isDetailedSenseType) &&
    isUserExamplesType(cast.user_examples)
  );
}
