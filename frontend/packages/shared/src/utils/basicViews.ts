import { KoreanSearchViewData } from "../types/panelAndViewTypes";

export const getBasicKoreanSearchViewData = ({
  searchTerm,
}: {
  searchTerm: string;
}): KoreanSearchViewData => {
  return {
    searchTerm: searchTerm,
  };
};
