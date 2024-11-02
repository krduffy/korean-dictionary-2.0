import { KoreanSearchConfig } from "../types/panelAndViewTypes";

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
