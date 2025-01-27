import { isBoolean, isObject } from "../../guardUtils";
import {
  BaseHanjaType,
  DetailedHanjaType,
  HanjaSearchResultType,
  isBaseHanjaType,
  KoreanHeadwordInExampleType,
} from "./hanjaDictionaryItems";
import {
  BaseKoreanHeadwordType,
  HeadwordDerivedExampleSearchResultType,
  DetailedKoreanType,
  isBaseKoreanHeadwordType,
  KoreanSearchResultType,
} from "./koreanDictionaryItems";

export type UserDataType = {
  is_known: boolean;
  is_studied: boolean;
};

export const getPkField = <T extends DictionaryItemType>(
  dictionaryItem: T
): BaseKoreanHeadwordType["target_code"] | BaseHanjaType["character"] => {
  if (isBaseKoreanHeadwordType(dictionaryItem))
    return dictionaryItem.target_code;
  return dictionaryItem.character;
};

export type ValidPkFieldType =
  | BaseKoreanHeadwordType["target_code"]
  | BaseHanjaType["character"];

export type DictionaryItemType = DetailItemType | SearchResultType;
export type DetailItemType = DetailedKoreanType | DetailedHanjaType;
export type SearchResultType =
  | KoreanSearchResultType
  | HanjaSearchResultType
  | KoreanHeadwordInExampleType;

/* Guards */

export function isUserData(value: unknown): value is UserDataType {
  return (
    isObject(value) && isBoolean(value.is_known) && isBoolean(value.is_studied)
  );
}
