import {
  DetailedSenseDropdownState,
  HanjaDetailInteractionData,
  KoreanDetailInteractionData,
  KoreanDetailUserExampleDropdownState,
} from "../views/interactionDataTypes";
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
  index: number;
}

export interface PushFindLemmaSuccessAction {
  type: "push_find_lemma_success";
  word: string;
}

export interface UpdateScrollDistanceAction {
  type: "update_scroll_distance";
  scrollDistance: number;
}

export interface UpdateKoreanDetailedSenseDropdownsAction {
  type: "update_korean_detail_dropdown_toggle";
  senseNumber: number;
  dropdownKey: keyof DetailedSenseDropdownState;
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

export interface UpdateKoreanDetailInteractionDataAction {
  type: "update_korean_detail_interaction_data";
  key: keyof KoreanDetailInteractionData;
  newValue: KoreanDetailInteractionData[keyof KoreanDetailInteractionData];
}

export interface UpdateKoreanDetailUserExampleInteractionDataAction {
  type: "update_korean_detail_user_example_interaction_data";
  key: keyof KoreanDetailUserExampleDropdownState;
  newValue: boolean;
}

export interface UpdateDetailedSenseDropdownStatesLengthAction {
  type: "update_detailed_sense_dropdown_states_length";
  newLength: number;
}

export interface PushDerivedExampleTextDetailAction {
  type: "push_lemma_derived_text_detail";
  sourceTextPk: number;
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
  | UpdateKoreanDetailedSenseDropdownsAction
  | UpdatePageAction
  | DeleteSearchConfigKeyAction
  | PushFindLemmaSuccessAction
  | UpdateHanjaDetailInteractionDataAction
  | UpdateKoreanDetailInteractionDataAction
  | UpdateDetailedSenseDropdownStatesLengthAction
  | UpdateKoreanDetailUserExampleInteractionDataAction
  | PushDerivedExampleTextDetailAction;
