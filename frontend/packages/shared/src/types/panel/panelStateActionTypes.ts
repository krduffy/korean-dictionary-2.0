import { HanjaDetailInteractionData } from "../views/interactionDataTypes";
import {
  HanjaSearchConfig,
  KoreanSearchConfig,
} from "../views/searchConfigTypes";

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

export interface PushFindLemmaSuccessAction {
  type: "push_find_lemma_success";
  word: string;
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

export interface UpdateHanjaDetailInteractionDataAction {
  type: "update_hanja_detail_interaction_data";
  key: keyof HanjaDetailInteractionData;
  newValue: HanjaDetailInteractionData[keyof HanjaDetailInteractionData];
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
  | DeleteSearchConfigKeyAction
  | PushFindLemmaSuccessAction
  | UpdateHanjaDetailInteractionDataAction;