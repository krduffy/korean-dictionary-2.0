import {
  DerivedExampleTextEojeolNumLemmasInteractionData,
  DerivedExampleTextInteractionData,
  KoreanUserExampleEditInteractionData,
  ListedDerivedExampleTextsInteractionData,
} from "./interactionDataTypes";

export type DerivedExampleTextDetailData = {
  source_text_pk: number;
};

export type DerivedExampleTextDetailView = {
  type: "lemma_derived_text_detail";
  data: DerivedExampleTextDetailData;
  interactionData: DerivedExampleTextInteractionData;
};

export interface DerivedExampleTextEojeolNumLemmasData {
  page: number;
  source_text_pk: number;
  eojeol_num: number;
}

export type DerivedExampleTextEojeolNumLemmasView = {
  type: "lemma_derived_text_eojeol_num_lemmas";
  data: DerivedExampleTextEojeolNumLemmasData;
  interactionData: DerivedExampleTextEojeolNumLemmasInteractionData;
};

export type ListedDerivedExampleTextsData = {
  searchTerm: string;
  searchPageNum: number;
};

export type ListedDerivedExampleTextsView = {
  type: "listed_derived_example_texts";
  data: ListedDerivedExampleTextsData;
  interactionData: ListedDerivedExampleTextsInteractionData;
};

export type KoreanUserExampleEditData = {
  headword: string;
  target_code: number;
};

export type KoreanUserExampleEditView = {
  type: "korean_user_example_edit_view";
  data: KoreanUserExampleEditData;
  interactionData: KoreanUserExampleEditInteractionData;
};
