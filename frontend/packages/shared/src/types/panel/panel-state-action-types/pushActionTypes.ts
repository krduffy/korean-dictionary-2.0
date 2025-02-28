import {
  HanjaSearchConfig,
  KoreanSearchConfig,
} from "../../views/searchConfigTypes";

export type PushActionType =
  | PushKoreanSearchAction
  | PushHanjaSearchAction
  | PushKoreanDetailAction
  | PushHanjaDetailAction
  | PushFindLemmaAction
  | PushDerivedExampleTextDetailAction
  | PushDerivedExampleTextEojeolNumLemmasAction
  | PushKoreanUserExampleEditView;

interface BasePushActionType {
  overwriteCurrentView?: boolean;
}

export interface PushKoreanSearchAction extends BasePushActionType {
  type: "push_korean_search";
  searchConfig: KoreanSearchConfig;
}

export interface PushHanjaSearchAction extends BasePushActionType {
  type: "push_hanja_search";
  searchConfig: HanjaSearchConfig;
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

export interface PushKoreanUserExampleEditView extends BasePushActionType {
  type: "push_korean_user_example_edit";
  headword: string;
  target_code: number;
}
