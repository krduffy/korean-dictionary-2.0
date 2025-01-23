import { isArrayOf, isNumber, isObject, isString } from "../../guardUtils";

export type BaseSenseType = {
  target_code: number;
  order: number;
  definition: string;
  pos: string;
  type: string;
  category: string;
};

export interface SimplifiedSenseType extends BaseSenseType {
  region_info?: RegionInfoType[];
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

export interface DetailedSenseType extends BaseSenseType {
  additional_info: SenseAdditionalInfoType;
}

export type RegionInfoType = {
  region: string;
};

export type ExampleType = {
  example: string;
  source?: string;
  /** Usually for when the example is dialect and it is rewritten in
   *  standard korean */
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

/* Guards */

export function isBaseSenseType(value: unknown): value is BaseSenseType {
  return (
    isObject(value) &&
    isNumber(value.target_code) &&
    isNumber(value.order) &&
    isString(value.definition) &&
    (value.pos === undefined || isString(value.pos)) &&
    (value.pos === undefined || isString(value.type)) &&
    (value.category === undefined || isString(value.category))
  );
}
export const isSimplifiedSenseType = isBaseSenseType;

/* Detailed sense guard */

export function isRegionInfoType(value: unknown): value is RegionInfoType {
  const x = isObject(value) && isString(value.region);

  return x;
}

export function isExampleType(value: unknown): value is ExampleType {
  const x =
    isObject(value) &&
    isString(value.example) &&
    (value.source === null || isString(value.source)) &&
    (value.translation === null || isString(value.translation)) &&
    (value.origin === null || isString(value.origin)) &&
    (value.region === null || isString(value.region));

  return x;
}

export function isRelationInfoType(value: unknown): value is RelationType {
  const x =
    isObject(value) &&
    (value.link_target_code === undefined ||
      isNumber(value.link_target_code)) &&
    isString(value.word) &&
    isString(value.type);

  return x;
}

export function isNormInfoType(value: unknown): value is NormType {
  const x =
    isObject(value) &&
    isString(value.desc) &&
    isString(value.role) &&
    isString(value.type);

  return x;
}

export function isGrammarInfoType(value: unknown): value is GrammarItemType {
  const x = isObject(value) && isString(value.grammar);

  return x;
}

export function isPatternInfoType(value: unknown): value is PatternType {
  const x = isObject(value) && isString(value.pattern);

  return x;
}

export function isProverbInfoType(value: unknown): value is ProverbType {
  const x =
    isObject(value) &&
    isString(value.definition) &&
    (value.link_target_code === undefined ||
      isNumber(value.link_target_code)) &&
    isString(value.word) &&
    isString(value.type);

  return x;
}

export function isSenseAdditionalInfoType(
  value: unknown
): value is SenseAdditionalInfoType {
  const x =
    isObject(value) &&
    (value.proverb_info === undefined ||
      isArrayOf(value.proverb_info, isProverbInfoType)) &&
    (value.pattern_info === undefined ||
      isArrayOf(value.pattern_info, isPatternInfoType)) &&
    (value.grammar_info === undefined ||
      isArrayOf(value.grammar_info, isGrammarInfoType)) &&
    (value.norm_info === undefined ||
      isArrayOf(value.norm_info, isNormInfoType)) &&
    (value.relation_info === undefined ||
      isArrayOf(value.relation_info, isRelationInfoType)) &&
    (value.example_info === undefined ||
      isArrayOf(value.example_info, isExampleType)) &&
    (value.region_info === undefined ||
      isArrayOf(value.region_info, isRegionInfoType));
  return x;
}

export function isDetailedSenseType(
  value: unknown
): value is DetailedSenseType {
  const x =
    isObject(value) &&
    isBaseSenseType(value) &&
    isSenseAdditionalInfoType((value as DetailedSenseType).additional_info);
  return x;
}
