/* SEARCH CONFIG OF SEARCH BAR */
export type SearchConfig =
  | { dictionary: "korean"; config: KoreanSearchConfig }
  | { dictionary: "hanja"; config: HanjaSearchConfig };

export interface BaseSearchConfig {
  search_term: string;
  page: number;
}

export type SearchConfigDictionary = "korean" | "hanja";

export type AllowedKoreanSearchType = "word_exact" | "definition_contains";
export interface KoreanSearchConfig extends BaseSearchConfig {
  search_type: AllowedKoreanSearchType;
}

export type OperandPrefix = "eq" | "gt" | "gte" | "lt" | "lte" | "not";
export type GradeLevel = "중학교" | "고등학교" | "미배정";
export type ExamLevel =
  | "8급"
  | "준7급"
  | "7급"
  | "준6급"
  | "6급"
  | "준5급"
  | "5급"
  | "준4급"
  | "4급"
  | "준3급"
  | "3급"
  | "준2급"
  | "2급"
  | "준1급"
  | "1급"
  | "준특급"
  | "특급"
  | "미배정";
export interface StrokeNumberConfig {
  operand: OperandPrefix;
  strokes: number;
}
export interface GradeLevelConfig {
  operand: OperandPrefix;
  level: GradeLevel;
}
export interface ExamLevelConfig {
  operand: OperandPrefix;
  level: ExamLevel;
}
export interface HanjaSearchConfig extends BaseSearchConfig {
  decomposition?: string;
  radical?: string;
  strokes?: StrokeNumberConfig;
  grade_level?: GradeLevelConfig;
  exam_level?: ExamLevelConfig;
}

/* VIEWS */

export type View =
  | KoreanSearchView
  | HanjaSearchView
  | KoreanDetailView
  | HanjaDetailView
  | FindLemmaView;

export interface BaseInteractionData {
  scrollDistance: number;
}

export interface KoreanDetailInteractionData extends BaseInteractionData {
  dropdowns: boolean[];
}

export interface KoreanSearchViewData extends KoreanSearchConfig {
  page: number;
}

export interface HanjaSearchViewData extends HanjaSearchConfig {
  page: number;
}

export interface KoreanSearchView {
  type: "korean_search";
  data: KoreanSearchViewData;
  interactionData: BaseInteractionData;
}

export interface HanjaSearchView {
  type: "hanja_search";
  data: HanjaSearchViewData;
  interactionData: BaseInteractionData;
}

export interface KoreanDetailViewData {
  target_code: number;
}

export interface KoreanDetailView {
  type: "korean_detail";
  data: KoreanDetailViewData;
  interactionData: KoreanDetailInteractionData;
}

export interface HanjaDetailViewData {
  character: string;
}

export interface HanjaDetailView {
  type: "hanja_detail";
  data: HanjaDetailViewData;
  interactionData: BaseInteractionData;
}

export interface FindLemmaData {
  word: string;
  sentence: string;
}

export interface FindLemmaView {
  type: "find_lemma";
  data: FindLemmaData;
  interactionData: BaseInteractionData;
}

export type ViewType =
  | "korean_search"
  | "hanja_search"
  | "korean_detail"
  | "hanja_detail"
  | "find_lemma";

/* PANEL */
export interface PanelState {
  visible: boolean;
  searchConfig: SearchConfig;
  view: View;
  historyData: HistoryData;
}

export type HistoryData = {
  views: View[];
  pointer: number;
  maxLength: number;
};

/* Dispatch actions */
export interface MakeVisibleAction {
  type: "make_visible";
}

export interface MakeInvisibleAction {
  type: "make_invisible";
}

export interface PushKoreanSearchAction {
  type: "push_korean_search";
  searchConfig: KoreanSearchConfig;
}

export interface PushHanjaSearchAction {
  type: "push_hanja_search";
  searchConfig: HanjaSearchConfig;
}

export interface PushKoreanDetailAction {
  type: "push_korean_detail";
  target_code: number;
}

export interface PushHanjaDetailAction {
  type: "push_hanja_detail";
  character: string;
}

export interface UpdateKoreanSearchConfigAction {
  type: "update_korean_search_config";
  field: keyof KoreanSearchConfig;
  value: KoreanSearchConfig[keyof KoreanSearchConfig];
}

export interface UpdateHanjaSearchConfigAction {
  type: "update_hanja_search_config";
  field: keyof HanjaSearchConfig;
  value: HanjaSearchConfig[keyof HanjaSearchConfig];
}

export interface SwitchDictionaryAction {
  type: "switch_dictionary";
}

export interface NavigateBackAction {
  type: "navigate_back";
}

export interface NavigateForwardAction {
  type: "navigate_forward";
}

export interface PushFindLemmaAction {
  type: "push_find_lemma";
  word: string;
  sentence: string;
}

export interface UpdateScrollDistanceAction {
  type: "update_scroll_distance";
  scrollDistance: number;
}

export interface UpdateKoreanDetailDropdownToggleAction {
  type: "update_korean_detail_dropdown_toggle";
  id: number;
  newIsDroppedDown: boolean;
}

export interface UpdatePageAction {
  type: "update_page";
  newPage: number;
}

export interface DeleteSearchConfigKeyAction {
  type: "delete_search_config_key";
  keyToDelete: string;
}

export type PanelStateAction =
  | MakeVisibleAction
  | MakeInvisibleAction
  | PushKoreanSearchAction
  | PushHanjaSearchAction
  | PushKoreanDetailAction
  | PushHanjaDetailAction
  | UpdateKoreanSearchConfigAction
  | UpdateHanjaSearchConfigAction
  | SwitchDictionaryAction
  | NavigateBackAction
  | NavigateForwardAction
  | PushFindLemmaAction
  | UpdateScrollDistanceAction
  | UpdateKoreanDetailDropdownToggleAction
  | UpdatePageAction
  | DeleteSearchConfigKeyAction;
