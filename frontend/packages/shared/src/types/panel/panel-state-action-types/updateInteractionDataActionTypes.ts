import {
  DerivedExampleTextInteractionData,
  DetailedSenseDropdownState,
  HanjaDetailInteractionData,
  KoreanDetailInteractionData,
  KoreanDetailUserExampleDropdownState,
  KoreanUserExampleEditInteractionData,
} from "../../views/interactionDataTypes";

export type UpdateInteractionDataActionType =
  | UpdateKoreanDetailedSenseDropdownsAction
  | UpdateHanjaDetailInteractionDataAction
  | UpdateKoreanDetailInteractionDataAction
  | UpdateDetailedSenseDropdownStatesLengthAction
  | UpdateKoreanDetailUserExampleInteractionDataAction
  | UpdateDerivedExampleTextInteractionDataAction
  | UpdateKoreanUserExampleEditInteractionData;

export interface UpdateKoreanDetailedSenseDropdownsAction {
  type: "update_korean_detail_dropdown_toggle";
  senseNumber: number;
  dropdownKey: keyof DetailedSenseDropdownState;
  newIsDroppedDown: boolean;
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

type UpdateDerivedExampleTextInteractionDataAction = {
  [K in keyof DerivedExampleTextInteractionData]: {
    type: "update_derived_example_text_interaction_data";
    key: K;
    newValue: DerivedExampleTextInteractionData[K];
  };
}[keyof DerivedExampleTextInteractionData];

type UpdateKoreanUserExampleEditInteractionData = {
  type: "update_korean_user_example_edit_interaction_data";
  key: keyof KoreanUserExampleEditInteractionData;
  newValue: boolean;
};
