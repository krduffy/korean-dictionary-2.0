import { DerivedExampleTextInteractionData } from "./interactionDataTypes";

export type DerivedExampleTextDetailData = {
  source_text_pk: number;
};

export type DerivedExampleTextDetailView = {
  type: "lemma_derived_text_detail";
  data: DerivedExampleTextDetailData;
  interactionData: DerivedExampleTextInteractionData;
};
