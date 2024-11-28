import { engKeyboardToKorean } from "../utils/keyboardConverter";
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
  // eslint-disable-next-line no-unused-vars
  deleteSearchConfigItemByKey: (keyToDelete: string) => void;
}

export const useSearchBarArea = ({
  searchConfig,
  dispatch,
  doConversion,
}: {
  searchConfig: SearchConfig;
  dispatch: React.Dispatch<PanelStateAction>;
  doConversion: boolean;
}): UseSearchBarAreaReturns => {
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(doConversion);

    if (doConversion) {
      const converted = engKeyboardToKorean(searchConfig.config.search_term);
      console.log(converted);

      if (searchConfig.dictionary === "korean") {
        dispatch({
          type: "update_korean_search_config",
          field: "search_term",
          value: converted,
        });
        dispatch({
          type: "push_korean_search",
          searchConfig: {
            ...searchConfig.config,
            search_term: converted,
          },
        });
      } else {
        dispatch({
          type: "update_hanja_search_config",
          field: "search_term",
          value: converted,
        });
        dispatch({
          type: "push_hanja_search",
          searchConfig: {
            ...searchConfig.config,
            search_term: converted,
          },
        });
      }
    } else {
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

  const deleteSearchConfigItemByKey = (keyToDelete: string) => {
    dispatch({
      type: "delete_search_config_key",
      keyToDelete: keyToDelete,
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
    deleteSearchConfigItemByKey,
  };
};
