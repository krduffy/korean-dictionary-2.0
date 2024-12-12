import {
  HanjaSearchConfig,
  KoreanSearchConfig,
  SearchBarConfig,
} from "../types/views/searchConfigTypes";
import { engKeyboardToKorean } from "../utils/keyboardConverter";
import { PanelStateAction } from "../types/panel/panelStateActionTypes";

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
  panelDispatchStateChangeSelf,
  doConversion,
}: {
  searchConfig: SearchBarConfig;
  panelDispatchStateChangeSelf: React.Dispatch<PanelStateAction>;
  doConversion: boolean;
}): UseSearchBarAreaReturns => {
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (doConversion) {
      const converted = engKeyboardToKorean(searchConfig.config.search_term);

      if (searchConfig.dictionary === "korean") {
        panelDispatchStateChangeSelf({
          type: "update_korean_search_config",
          field: "search_term",
          value: converted,
        });
        panelDispatchStateChangeSelf({
          type: "push_korean_search",
          searchConfig: {
            ...searchConfig.config,
            search_term: converted,
          },
        });
      } else {
        panelDispatchStateChangeSelf({
          type: "update_hanja_search_config",
          field: "search_term",
          value: converted,
        });
        panelDispatchStateChangeSelf({
          type: "push_hanja_search",
          searchConfig: {
            ...searchConfig.config,
            search_term: converted,
          },
        });
      }
    } else {
      if (searchConfig.dictionary === "korean") {
        panelDispatchStateChangeSelf({
          type: "push_korean_search",
          searchConfig: searchConfig.config,
        });
      } else {
        panelDispatchStateChangeSelf({
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
    panelDispatchStateChangeSelf({
      type: "update_korean_search_config",
      field: field,
      value: value,
    });
  };

  const updateHanjaSearchConfig = ({
    field,
    value,
  }: UpdateHanjaSearchConfigArgs) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_search_config",
      field: field,
      value: value,
    });
  };

  const deleteSearchConfigItemByKey = (keyToDelete: string) => {
    panelDispatchStateChangeSelf({
      type: "delete_search_config_key",
      keyToDelete: keyToDelete,
    });
  };

  const updateSearchTerm = (searchTerm: string) => {
    if (searchConfig.dictionary === "korean") {
      panelDispatchStateChangeSelf({
        type: "update_korean_search_config",
        field: "search_term",
        value: searchTerm,
      });
    } else if (searchConfig.dictionary === "hanja") {
      panelDispatchStateChangeSelf({
        type: "update_hanja_search_config",
        field: "search_term",
        value: searchTerm,
      });
    }
  };

  const switchDictionary = () => {
    panelDispatchStateChangeSelf({ type: "switch_dictionary" });
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
