import { isBoolean, isObject } from "../guardUtils";

export interface BaseInteractionData {
  scrollDistance: number;
}

/* currently nothing except for the scroll distance */
export type KoreanSearchInteractionData = BaseInteractionData;
export type FindLemmaInteractionData = BaseInteractionData;
export type HanjaSearchInteractionData = BaseInteractionData;

export type DetailedSenseDropdownState = {
  exampleInfoDroppedDown: boolean;
  otherInfoBoxDroppedDown: boolean;
  grammarInfoDroppedDown: boolean;
  normInfoDroppedDown: boolean;
  relationInfoDroppedDown: boolean;
  proverbInfoDroppedDown: boolean;
};

export interface KoreanDetailInteractionData extends BaseInteractionData {
  historyDroppedDown: boolean;
  detailedSenseDropdowns: DetailedSenseDropdownState[];
}

export interface HanjaDetailInteractionData extends BaseInteractionData {
  seenInitialAnimation: boolean;
  explanationDroppedDown: boolean;
  exampleWordsDroppedDown: boolean;
  nextStrokeNum: number;
  isLooping: boolean;
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
