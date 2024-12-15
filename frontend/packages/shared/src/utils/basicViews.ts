import {
  HanjaSearchConfig,
  KoreanSearchConfig,
} from "../types/panelAndViewTypes";

export const getBasicKoreanSearchViewData = ({
  searchTerm,
}: {
  searchTerm: string;
}): KoreanSearchConfig => {
  return {
    search_term: searchTerm,
    search_type: "word_exact",
    page: 1,
  };
};

export const getBasicHanjaSearchViewData = ({
  searchTerm,
}: {
  searchTerm: string;
}): HanjaSearchConfig => {
  return {
    /* none of the optional things like grade level here */
    search_term: searchTerm,
    page: 1,
  };
};

export const getDefaultDetailedSenseDropdowns = () => ({
  exampleInfoDroppedDown: false,
  otherInfoBoxDroppedDown: false,
  grammarInfoDroppedDown: true,
  normInfoDroppedDown: true,
  relationInfoDroppedDown: true,
  proverbInfoDroppedDown: true,
});
