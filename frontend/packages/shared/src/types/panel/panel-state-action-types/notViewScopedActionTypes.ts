import {
  HanjaSearchConfig,
  KoreanSearchConfig,
} from "../../views/searchConfigTypes";

export type NotViewScopedActionType =
  | MakeVisibleAction
  | MakeInvisibleAction
  | UpdateKoreanSearchConfigAction
  | UpdateHanjaSearchConfigAction
  | SwitchDictionaryAction
  | NavigateBackAction
  | NavigateForwardAction
  | UpdateScrollDistanceAction
  | UpdatePageAction
  | DeleteSearchConfigKeyAction;

/* Dispatch actions */
export interface MakeVisibleAction {
  type: "make_visible";
}

export interface MakeInvisibleAction {
  type: "make_invisible";
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

export interface UpdateScrollDistanceAction {
  type: "update_scroll_distance";
  scrollDistance: number;
}

export interface UpdatePageAction {
  type: "update_page";
  newPage: number;
}

export interface DeleteSearchConfigKeyAction {
  type: "delete_search_config_key";
  keyToDelete: string;
}
