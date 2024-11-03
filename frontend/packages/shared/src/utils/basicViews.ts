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
  };
};

export const getBasicHanjaSearchViewData = ({
  searchTerm,
}: {
  searchTerm: string;
}): HanjaSearchConfig => {
  return {
    search_term: searchTerm,
  };
};
