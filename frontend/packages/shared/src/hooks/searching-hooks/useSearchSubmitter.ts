import {
  SearchConfig,
  UseSearchSubmitterArgs,
  View,
} from "../../types/panelAndViewTypes";

export const useSearchSubmitter = ({
  setView,
  searchConfig,
}: UseSearchSubmitterArgs) => {
  const getViewFromSearchConfig = (searchConfig: SearchConfig): View => {
    if (searchConfig.dictionary === "korean") {
      return {
        searchConfig: searchConfig,
        type: "korean_search",
        data: searchConfig.config,
      };
    } else {
      return {
        searchConfig: searchConfig,
        type: "hanja_search",
        data: searchConfig.config,
      };
    }
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setView(getViewFromSearchConfig(searchConfig));
  };

  return {
    submitSearch,
  };
};
