import {
  getBasicHanjaSearchViewData,
  getBasicKoreanSearchViewData,
} from "your-package/utils/basicViews";
import {
  UseSearchConfigSettersReturns,
  UseSearchConfigSettersArgs,
  SearchConfig,
  KoreanSearchConfig,
  AllowedKoreanSearchType,
  HanjaSearchConfig,
} from "../../types/panelAndViewTypes";

export const useSearchConfigSetters = ({
  searchConfig,
  setSearchConfig,
}: UseSearchConfigSettersArgs): UseSearchConfigSettersReturns => {
  const updateTopKey = <K extends keyof SearchConfig>(
    key: K,
    value: SearchConfig[K]
  ) => {
    const newSearchConfig = {
      ...searchConfig,
      [String(key)]: value,
    } as const;

    setSearchConfig(newSearchConfig);
  };

  const setSearchTerm = (searchTerm: string) => {
    const newConfig = {
      ...searchConfig.config,
      search_term: searchTerm,
    };
    updateTopKey("config", newConfig);
  };

  const switchDictionary = () => {
    if (searchConfig.dictionary === "korean") {
      setSearchConfig({
        dictionary: "hanja",
        config: getBasicHanjaSearchViewData({
          searchTerm: searchConfig.config.search_term,
        }),
      });
    } else {
      setSearchConfig({
        dictionary: "korean",
        config: getBasicKoreanSearchViewData({
          searchTerm: searchConfig.config.search_term,
        }),
      });
    }
  };

  const setKoreanSearchParam = <K extends keyof KoreanSearchConfig>(
    key: K,
    value: KoreanSearchConfig[K]
  ) => {
    const newConfig = {
      ...searchConfig.config,
      [String(key)]: value,
    };

    updateTopKey("config", newConfig);
  };

  /* FOR KOREAN SEARCHING */
  const setKoreanSearchType = (newType: AllowedKoreanSearchType) => {
    setKoreanSearchParam("search_type", newType);
  };

  /* FOR HANJA SEARCHING */

  return {
    searchConfigSetters: {
      setSearchTerm,
      switchDictionary,
      /* For korean. */
      setKoreanSearchType,
    },
  };
};
