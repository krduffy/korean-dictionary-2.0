export interface BaseInteractionData {
  scrollDistance: number;
}

/* currently nothing except for the scroll distance */
export type KoreanSearchInteractionData = BaseInteractionData;
export type FindLemmaInteractionData = BaseInteractionData;
export type HanjaSearchInteractionData = BaseInteractionData;

export interface KoreanDetailInteractionData extends BaseInteractionData {
  dropdowns: boolean[];
}

export interface HanjaDetailInteractionData extends BaseInteractionData {
  seenInitialAnimation: boolean;
  explanationDroppedDown: boolean;
  exampleWordsDroppedDown: boolean;
  nextStrokeNum: number;
  isLooping: boolean;
  exampleWordsPageNum: number;
}
