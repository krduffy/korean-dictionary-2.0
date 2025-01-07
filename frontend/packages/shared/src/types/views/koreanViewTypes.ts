import {
  FindLemmaInteractionData,
  KoreanDetailInteractionData,
  KoreanSearchInteractionData,
} from "./interactionDataTypes";
import { KoreanSearchConfig } from "./searchConfigTypes";

export interface KoreanSearchViewData extends KoreanSearchConfig {
  page: number;
}

export interface KoreanSearchView {
  type: "korean_search";
  data: KoreanSearchViewData;
  interactionData: KoreanSearchInteractionData;
}

export interface KoreanDetailViewData {
  target_code: number;
}

export interface KoreanDetailView {
  type: "korean_detail";
  data: KoreanDetailViewData;
  interactionData: KoreanDetailInteractionData;
}

export interface FindLemmaData {
  word: string;
  sentence: string;
  index: number;
}

export interface FindLemmaView {
  type: "find_lemma";
  data: FindLemmaData;
  interactionData: FindLemmaInteractionData;
}
