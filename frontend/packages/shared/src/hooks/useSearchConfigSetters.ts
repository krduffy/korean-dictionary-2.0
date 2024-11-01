import {
  UseSearchConfigSettersReturns,
  UseSearchConfigSettersArgs,
} from "../types/panelAndViewTypes";

export const useSearchConfigSetters = ({
  searchConfig,
  setSearchConfig,
}: UseSearchConfigSettersArgs): UseSearchConfigSettersReturns => {
  const setSearchTerm = (searchTerm: string) => {
    const newSearchConfig = {
      ...searchConfig,
      searchTerm: searchTerm,
    } as const;

    setSearchConfig(newSearchConfig);
  };

  const switchDictionary = () => {
    const otherDictionary =
      searchConfig.dictionary === "korean" ? "hanja" : "korean";
    const newSearchConfig = {
      ...searchConfig,
      dictionary: otherDictionary,
    } as const;

    setSearchConfig(newSearchConfig);
  };

  return {
    searchConfigSetters: {
      setSearchTerm,
      switchDictionary,
    },
  };
};
