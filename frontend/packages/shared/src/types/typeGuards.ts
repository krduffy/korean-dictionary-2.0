import {
  BaseHanjaType,
  BaseKoreanWordType,
  BaseSenseType,
  DetailedKoreanType,
  DetailedSenseType,
  ExampleType,
  GrammarItemType,
  HanjaPopupType,
  HanjaSearchResultType,
  HistoryInfoType,
  KoreanSearchResultType,
  KoreanWordInHanjaPopupType,
  MeaningReadings,
  NormType,
  PatternType,
  ProverbType,
  RegionInfoType,
  RelationType,
  SenseAdditionalInfoType,
  UserDataType,
} from "./dictionaryItemProps";

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

export function isArrayOf<T>(
  value: unknown,
  check: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(check);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**********************************************/

export function isUserData(value: unknown): value is UserDataType {
  return (
    isObject(value) && isBoolean(value.is_known) && isBoolean(value.is_studied)
  );
}

export function isBaseSenseType(value: unknown): value is BaseSenseType {
  return (
    isObject(value) &&
    isNumber(value.target_code) &&
    isNumber(value.order) &&
    isString(value.definition) &&
    isString(value.pos) &&
    isString(value.type) &&
    isString(value.category)
  );
}

export const isSimplifiedSenseType = isBaseSenseType;

export function isBaseKoreanWordType(
  value: unknown
): value is BaseKoreanWordType {
  return (
    isObject(value) &&
    isNumber(value.target_code) &&
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
    isString(value.word_type) &&
    isArrayOf(value.senses, isSimplifiedSenseType)
  );
}

export function isRegionInfoType(value: unknown): value is RegionInfoType {
  return isObject(value) && isString(value.region);
}

export function isExampleType(value: unknown): value is ExampleType {
  return (
    isObject(value) &&
    isString(value.example) &&
    isString(value.source) &&
    (value.translation === undefined || isString(value.translation)) &&
    (value.origin === undefined || isString(value.origin)) &&
    (value.region === undefined || isString(value.region))
  );
}

export function isRelationInfoType(value: unknown): value is RelationType {
  return (
    isObject(value) &&
    isNumber(value.link_target_code) &&
    isString(value.word) &&
    isString(value.type)
  );
}

export function isNormInfoType(value: unknown): value is NormType {
  return (
    isObject(value) &&
    isString(value.desc) &&
    isString(value.role) &&
    isString(value.type)
  );
}

export function isGrammarInfoType(value: unknown): value is GrammarItemType {
  return isObject(value) && isString(value.grammar);
}

export function isPatternInfoType(value: unknown): value is PatternType {
  return isObject(value) && isString(value.pattern);
}

export function isProverbInfoType(value: unknown): value is ProverbType {
  return (
    isObject(value) &&
    isString(value.definition) &&
    isNumber(value.link_target_code) &&
    isString(value.word) &&
    isString(value.type)
  );
}

export function isHistoryInfoType(value: unknown): value is HistoryInfoType {
  return (
    isObject(value) &&
    isString(value.desc) &&
    isString(value.word_info) &&
    isString(value.allomorph) &&
    isString(value.history_sense_info) &&
    isString(value.remark)
  );
}

export function isDetailedKoreanType(
  value: unknown
): value is DetailedKoreanType {
  return (
    isObject(value) &&
    isBaseKoreanWordType(value) &&
    isString(value.word_type) &&
    (value.history_info === null || isHistoryInfoType(value.history_info)) &&
    isArrayOf(value.senses, isDetailedSenseType)
  );
}

export function isSenseAdditionalInfoType(
  value: unknown
): value is SenseAdditionalInfoType {
  return (
    isObject(value) &&
    (value.proverb_info === undefined ||
      isProverbInfoType(value.proverb_info)) &&
    (value.pattern_info === undefined ||
      isPatternInfoType(value.pattern_info)) &&
    (value.grammar_info === undefined ||
      isGrammarInfoType(value.grammar_info)) &&
    (value.norm_info === undefined || isNormInfoType(value.norm_info)) &&
    (value.relation_info === undefined ||
      isRegionInfoType(value.relation_info)) &&
    (value.example_info === undefined ||
      isArrayOf(value.example_info, isExampleType)) &&
    (value.region_info === undefined || isRegionInfoType(value.region_info))
  );
}

export function isDetailedSenseType(
  value: unknown
): value is DetailedSenseType {
  return (
    isObject(value) &&
    isBaseSenseType(value) &&
    isSenseAdditionalInfoType(value.additional_info)
  );
}

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
