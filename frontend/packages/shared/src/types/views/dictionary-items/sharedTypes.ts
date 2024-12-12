import { isBoolean, isObject } from "../../guardUtils";
import {
  BaseHanjaType,
  DetailedHanjaType,
  HanjaSearchResultType,
  KoreanWordInHanjaExamplesType,
} from "./hanjaDictionaryItems";
import {
  BaseKoreanWordType,
  DetailedKoreanType,
  isBaseKoreanWordType,
  KoreanSearchResultType,
} from "./koreanDictionaryItems";

export type UserDataType = {
  is_known: boolean;
  is_studied: boolean;
};

export const getPkField = <T extends DictionaryItemType>(
  dictionaryItem: T
): BaseKoreanWordType["target_code"] | BaseHanjaType["character"] => {
  if (isBaseKoreanWordType(dictionaryItem)) return dictionaryItem.target_code;
  return dictionaryItem.character;
};

export type DictionaryItemType = DetailItemType | SearchResultType;
export type DetailItemType = DetailedKoreanType | DetailedHanjaType;
export type SearchResultType =
  | KoreanSearchResultType
  | HanjaSearchResultType
  | KoreanWordInHanjaExamplesType;

/* Guards */

export function isUserData(value: unknown): value is UserDataType {
  return (
    isObject(value) && isBoolean(value.is_known) && isBoolean(value.is_studied)
  );
}
