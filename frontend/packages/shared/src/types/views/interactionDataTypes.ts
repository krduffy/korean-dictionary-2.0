import { isBoolean, isObject } from "../guardUtils";

export interface BaseInteractionData {
  scrollDistance: number;
}

/* currently nothing except for the scroll distance */
export type PanelHomepageInteractionData = BaseInteractionData;
export type KoreanSearchInteractionData = BaseInteractionData;
export type FindLemmaInteractionData = BaseInteractionData;
export type HanjaSearchInteractionData = BaseInteractionData;

export type DetailedSenseDropdownState = {
  additionalInfoBoxDroppedDown: boolean;
  exampleInfoDroppedDown: boolean;
  grammarInfoDroppedDown: boolean;
  normInfoDroppedDown: boolean;
  relationInfoDroppedDown: boolean;
  proverbInfoDroppedDown: boolean;
};

export type KoreanDetailUserExampleDropdownState = {
  /* top level; other three are nested */
  userExamplesDroppedDown: boolean;
  /* sentences includes autoderived lemmas */
  sentencesDroppedDown: boolean;
  imagesDroppedDown: boolean;
  videosDroppedDown: boolean;
};

export interface KoreanDetailInteractionData extends BaseInteractionData {
  historyDroppedDown: boolean;
  sensesDroppedDown: boolean;
  detailedSenseDropdowns: DetailedSenseDropdownState[];
  userExampleDropdowns: KoreanDetailUserExampleDropdownState;
}

export interface HanjaDetailInteractionData extends BaseInteractionData {
  explanationDroppedDown: boolean;
  exampleWordsDroppedDown: boolean;
  exampleWordsPageNum: number;
}

/* guards */

export function isDetailedSenseDropdownState(
  value: unknown
): value is DetailedSenseDropdownState {
  return (
    isObject(value) &&
    isBoolean(value.exampleInfoDroppedDown) &&
    isBoolean(value.otherInfoBoxDroppedDown) &&
    isBoolean(value.grammarInfoDroppedDown) &&
    isBoolean(value.normInfoDroppedDown) &&
    isBoolean(value.relationInfoDroppedDown) &&
    isBoolean(value.proverbInfoDroppedDown)
  );
}
