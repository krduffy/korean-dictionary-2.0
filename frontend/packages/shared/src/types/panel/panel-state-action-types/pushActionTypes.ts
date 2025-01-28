import {
  HanjaSearchConfig,
  KoreanSearchConfig,
} from "../../views/searchConfigTypes";
import {
  DetailedKoreanType,
  KoreanSearchResultType,
} from "src/types/views/dictionary-items/koreanDictionaryItems";

export type PushActionType =
  | PushKoreanSearchAction
  | PushKoreanSearchActionAlreadyFetched
  | PushHanjaSearchAction
  | PushKoreanDetailAction
  | PushKoreanDetailActionAlreadyFetched
  | PushHanjaDetailAction
  | PushFindLemmaAction
  | PushDerivedExampleTextDetailAction
  | PushDerivedExampleTextEojeolNumLemmasAction;

interface BasePushActionType {
  overwriteCurrentView?: boolean;
}

export interface PushKoreanSearchActionAlreadyFetched
  extends BasePushActionType {
  type: "push_korean_search_already_fetched";
  searchResults: KoreanSearchResultType[];
}

export interface PushKoreanSearchAction extends BasePushActionType {
  type: "push_korean_search";
  searchConfig: KoreanSearchConfig;
}

export interface PushHanjaSearchAction extends BasePushActionType {
  type: "push_hanja_search";
  searchConfig: HanjaSearchConfig;
}

export interface PushKoreanDetailActionAlreadyFetched
  extends BasePushActionType {
  type: "push_korean_detail_already_fetched";
  data: DetailedKoreanType;
}

export interface PushKoreanDetailAction extends BasePushActionType {
  type: "push_korean_detail";
  target_code: number;
}

export interface PushHanjaDetailAction extends BasePushActionType {
  type: "push_hanja_detail";
  character: string;
}

export interface PushFindLemmaAction extends BasePushActionType {
  type: "push_find_lemma";
  word: string;
  sentence: string;
  index: number;
}

export interface PushDerivedExampleTextDetailAction extends BasePushActionType {
  type: "push_lemma_derived_text_detail";
  sourceTextPk: number;
  highlightEojeolNumOnLoad: number | null;
}

export interface PushDerivedExampleTextEojeolNumLemmasAction
  extends BasePushActionType {
  type: "push_derived_example_text_eojeol_num_lemmas";
  sourceTextPk: number;
  eojeolNum: number;
}
