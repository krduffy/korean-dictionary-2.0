import {
  SearchConfig,
  SearchConfigDictionary,
  UseSearchSubmitterArgs,
  View,
  ViewType,
} from "../types/panelAndViewTypes";

export const useSearchSubmitter = ({
  setView,
  searchConfig,
}: UseSearchSubmitterArgs) => {
  const getType = ({
    searchTerm,
    dictionary,
  }: {
    searchTerm: string;
    dictionary: SearchConfigDictionary;
  }): ViewType => {
    if (dictionary === "korean") {
      return "korean_search";
    }

    return "hanja_search";
  };

  const getViewFromSearchConfig = (searchConfig: SearchConfig): View => {
    return {
      searchConfig: searchConfig,
      type: getType({
        searchTerm: searchConfig.searchTerm,
        dictionary: searchConfig.dictionary,
      }),
      data: {
        searchTerm: searchConfig.searchTerm,
      },
    };
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setView(getViewFromSearchConfig(searchConfig));
  };

  return {
    submitSearch,
  };
};
