import { isNumber, isObject, isString, isTypeOrNull } from "../../guardUtils";
import {
  isKoreanHeadwordInExampleType,
  KoreanHeadwordInExampleType,
} from "./koreanDictionaryItems";

export type DerivedExampleTextType = {
  id: number;
  text: string;
  source: string;
  image_url: string | null;
};

export interface DerivedExampleTextHeadwordFromTextType {
  lemma: string;
  eojeol_number_in_source_text: number;
  headword_ref: KoreanHeadwordInExampleType;
}

export interface HeadwordDerivedExampleSearchResultType {
  source_text_preview: string;
  lemma: string;
  source: string;
  source_text_pk: number;
  eojeol_number_in_source_text: number;
  image_url?: string;
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
/* Guards */

export function isDerivedExampleTextType(
  value: unknown
): value is DerivedExampleTextType {
  return (
    isObject(value) &&
    isNumber(value.id) &&
    isString(value.text) &&
    isString(value.source) &&
    isTypeOrNull(value.image_url, isString)
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

export function isDerivedExampleTextHeadwordFromTextType(
  value: unknown
): value is DerivedExampleTextHeadwordFromTextType {
  return (
    isObject(value) &&
    isString(value.lemma) &&
    isNumber(value.eojeol_number_in_source_text) &&
    isKoreanHeadwordInExampleType(value.headword_ref)
  );
}

export function isUserExampleSentenceType(
  value: unknown
): value is UserExampleSentenceType {
  if (!isBaseExampleType(value)) return false;

  const cast = value as UserExampleSentenceType;

  return isString(cast.sentence);
}

export function isHeadwordDerivedExampleSearchResultType(
  value: unknown
): value is HeadwordDerivedExampleSearchResultType {
  return (
    isObject(value) &&
    isString(value.source_text_preview) &&
    isString(value.lemma) &&
    isString(value.source) &&
    isNumber(value.source_text_pk) &&
    isNumber(value.eojeol_number_in_source_text)
  );
}
