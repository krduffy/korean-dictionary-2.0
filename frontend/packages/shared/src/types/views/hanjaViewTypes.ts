import {
  HanjaDetailInteractionData,
  HanjaSearchInteractionData,
} from "./interactionDataTypes";
import { HanjaSearchConfig } from "./searchConfigTypes";

export interface HanjaSearchViewData extends HanjaSearchConfig {
  page: number;
}

export interface HanjaSearchView {
  type: "hanja_search";
  data: HanjaSearchViewData;
  interactionData: HanjaSearchInteractionData;
}

export interface HanjaDetailViewData {
  character: string;
}

export interface HanjaDetailView {
  type: "hanja_detail";
  data: HanjaDetailViewData;
  interactionData: HanjaDetailInteractionData;
}
