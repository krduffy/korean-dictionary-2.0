import {
  BaseHanjaType,
  BaseKoreanWordType,
  BaseSenseType,
  DetailedHanjaType,
  DetailedKoreanType,
  DetailedSenseType,
  ExampleType,
  GrammarItemType,
  HanjaPopupType,
  HanjaSearchResultType,
  HistoryCenturyExampleType,
  HistoryCenturyInfoType,
  HistoryInfoType,
  HistorySenseInfoItem,
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
    (value.pos === undefined || isString(value.pos)) &&
    (value.pos === undefined || isString(value.type)) &&
    (value.category === undefined || isString(value.category))
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
  const x = isObject(value) && isString(value.region);
  //if (!x) console.log(value);
  return x;
}

export function isExampleType(value: unknown): value is ExampleType {
  const x =
    isObject(value) &&
    isString(value.example) &&
    (value.source === undefined || isString(value.source)) &&
    (value.translation === undefined || isString(value.translation)) &&
    (value.origin === undefined || isString(value.origin)) &&
    (value.region === undefined || isString(value.region));
  //if (!x) console.log(value);
  return x;
}

export function isRelationInfoType(value: unknown): value is RelationType {
  const x =
    isObject(value) &&
    (value.link_target_code === undefined ||
      isNumber(value.link_target_code)) &&
    isString(value.word) &&
    isString(value.type);
  //if (!x) console.log(value);
  return x;
}

export function isNormInfoType(value: unknown): value is NormType {
  const x =
    isObject(value) &&
    isString(value.desc) &&
    isString(value.role) &&
    isString(value.type);
  //if (!x) console.log(value);
  return x;
}

export function isGrammarInfoType(value: unknown): value is GrammarItemType {
  const x = isObject(value) && isString(value.grammar);
  //if (!x) console.log(value);
  return x;
}

export function isPatternInfoType(value: unknown): value is PatternType {
  const x = isObject(value) && isString(value.pattern);
  //if (!x) console.log(value);
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
  //if (!x) console.log(value);
  return x;
}

function isHistoryCenturyExampleType(
  value: unknown
): value is HistoryCenturyExampleType {
  const x =
    isObject(value) &&
    isString(value.source) &&
    isString(value.example) &&
    (value.origin === undefined || isString(value.origin));
  //if (!x) console.log(value);
  return x;
}

function isHistoryCenturyInfo(value: unknown): value is HistoryCenturyInfoType {
  const x =
    isObject(value) &&
    isArrayOf(value.history_example_info, isHistoryCenturyExampleType) &&
    isString(value.century) &&
    isString(value.mark);
  /*if (!x) {
    console.log(value);
    console.table([
      isObject(value),
      isArrayOf(value.history_example_info, isHistoryCenturyExampleType),
      isString(value.century),
      isString(value.mark),
    ]);
  }*/
  return x;
}

function isHistorySenseInfoItem(value: unknown): value is HistorySenseInfoItem {
  const x =
    isObject(value) &&
    isArrayOf(value.history_century_info, isHistoryCenturyInfo);
  //if (!x) console.log(value);
  return x;
}

export function isHistoryInfoType(value: unknown): value is HistoryInfoType {
  const x =
    isObject(value) &&
    isString(value.desc) &&
    isString(value.word_form) &&
    isString(value.allomorph) &&
    isArrayOf(value.history_sense_info, isHistorySenseInfoItem) &&
    (value.remark === undefined || isString(value.remark));
  //if (!x) console.log(value);
  return x;
}

export function isDetailedKoreanType(
  value: unknown
): value is DetailedKoreanType {
  const x =
    isObject(value) &&
    isBaseKoreanWordType(value) &&
    isString(value.word_type) &&
    (value.history_info === null || isHistoryInfoType(value.history_info)) &&
    isArrayOf(value.senses, isDetailedSenseType);
  //if (!x) console.log(value);
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
  if (!x)
    console.table([
      value.proverb_info === undefined ||
        isArrayOf(value.proverb_info, isProverbInfoType),
      value.pattern_info === undefined ||
        isArrayOf(value.pattern_info, isPatternInfoType),
      value.grammar_info === undefined ||
        isArrayOf(value.grammar_info, isGrammarInfoType),
      value.norm_info === undefined ||
        isArrayOf(value.norm_info, isNormInfoType),
      value.relation_info === undefined ||
        isArrayOf(value.relation_info, isRelationInfoType),
      value.example_info === undefined ||
        isArrayOf(value.example_info, isExampleType),
      value.region_info === undefined ||
        isArrayOf(value.region_info, isRegionInfoType),
    ]);
  return x;
}

export function isDetailedSenseType(
  value: unknown
): value is DetailedSenseType {
  const x =
    isObject(value) &&
    isBaseSenseType(value) &&
    isSenseAdditionalInfoType(value.additional_info);
  /*if (!x) {
    console.log(value);
    console.table([
      isObject(value),
      isBaseSenseType(value),
      isSenseAdditionalInfoType(value.additional_info),
    ]);
  }*/
  return x;
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
