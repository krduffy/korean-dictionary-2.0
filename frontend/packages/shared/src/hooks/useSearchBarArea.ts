import {
  HanjaSearchConfig,
  KoreanSearchConfig,
  PanelStateAction,
  SearchConfig,
} from "../types/panelAndViewTypes";

export interface UpdateKoreanSearchConfigArgs {
  field: keyof KoreanSearchConfig;
  value: KoreanSearchConfig[keyof KoreanSearchConfig];
}

export interface UpdateHanjaSearchConfigArgs {
  field: keyof HanjaSearchConfig;
  value: HanjaSearchConfig[keyof HanjaSearchConfig];
}

interface UseSearchBarAreaReturns {
  // eslint-disable-next-line no-unused-vars
  submitSearch: (e: React.FormEvent) => void;
  updateKoreanSearchConfig: ({
    // eslint-disable-next-line no-unused-vars
    field,
    // eslint-disable-next-line no-unused-vars
    value,
  }: UpdateKoreanSearchConfigArgs) => void;
  updateHanjaSearchConfig: ({
    // eslint-disable-next-line no-unused-vars
    field,
    // eslint-disable-next-line no-unused-vars
    value,
  }: UpdateHanjaSearchConfigArgs) => void;
  // eslint-disable-next-line no-unused-vars
  updateSearchTerm: (searchTerm: string) => void;
  switchDictionary: () => void;
}

export const useSearchBarArea = ({
  searchConfig,
  dispatch,
}: {
  searchConfig: SearchConfig;
  dispatch: React.Dispatch<PanelStateAction>;
}): UseSearchBarAreaReturns => {
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchConfig.dictionary === "korean") {
      dispatch({
        type: "push_korean_search",
        searchConfig: searchConfig.config,
      });
    } else {
      dispatch({
        type: "push_hanja_search",
        searchConfig: searchConfig.config,
      });
    }
  };

  const updateKoreanSearchConfig = ({
    field,
    value,
  }: UpdateKoreanSearchConfigArgs) => {
    dispatch({
      type: "update_korean_search_config",
      field: field,
      value: value,
    });
  };

  const updateHanjaSearchConfig = ({
    field,
    value,
  }: UpdateHanjaSearchConfigArgs) => {
    dispatch({
      type: "update_hanja_search_config",
      field: field,
      value: value,
    });
  };

  const updateSearchTerm = (searchTerm: string) => {
    if (searchConfig.dictionary === "korean") {
      dispatch({
        type: "update_korean_search_config",
        field: "search_term",
        value: searchTerm,
      });
    } else if (searchConfig.dictionary === "hanja") {
      dispatch({
        type: "update_hanja_search_config",
        field: "search_term",
        value: searchTerm,
      });
    }
  };

  const switchDictionary = () => {
    dispatch({ type: "switch_dictionary" });
  };

  return {
    submitSearch,
    updateKoreanSearchConfig,
    updateHanjaSearchConfig,
    updateSearchTerm,
    switchDictionary,
  };
};
