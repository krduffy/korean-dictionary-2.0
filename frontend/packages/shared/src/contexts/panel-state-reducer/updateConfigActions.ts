import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { PanelState } from "@repo/shared/types/panel/panelTypes";
import { SearchBarConfig } from "@repo/shared/types/views/searchConfigTypes";
import {
  getBasicHanjaSearchViewData,
  getBasicKoreanSearchViewData,
} from "@repo/shared/utils/basicViews";

const getPanelStateWithDeletedSearchConfigKey = (
  state: PanelState,
  keyToDelete: string
) => {
  const newConfig = Object.entries(state.searchConfig.config).filter(
    ([key]) => {
      return key !== keyToDelete;
    }
  );

  return {
    ...state,
    searchConfig: {
      ...state.searchConfig,
      config: Object.fromEntries(newConfig),
    } as SearchBarConfig,
  };
};

const switchDictionary = (state: PanelState): PanelState => {
  if (state.searchConfig.dictionary === "hanja") {
    return {
      ...state,
      searchConfig: {
        ...state.searchConfig,
        dictionary: "korean",
        config: {
          ...getBasicKoreanSearchViewData({ searchTerm: "" }),
          search_term: state.searchConfig.config.search_term,
        },
      },
    };
  } else {
    return {
      ...state,
      searchConfig: {
        ...state.searchConfig,
        dictionary: "hanja",
        config: {
          ...getBasicHanjaSearchViewData({ searchTerm: "" }),
          search_term: state.searchConfig.config.search_term,
        },
      },
    };
  }
};

export const updateConfigIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "update_korean_search_config":
      if (state.searchConfig.dictionary !== "korean") {
        return state;
      }
      return {
        ...state,
        searchConfig: {
          ...state.searchConfig,
          config: {
            ...state.searchConfig.config,
            [action.field]: action.value,
          },
        },
      };

    case "update_hanja_search_config":
      if (state.searchConfig.dictionary !== "hanja") {
        return state;
      }
      return {
        ...state,
        searchConfig: {
          ...state.searchConfig,
          config: {
            ...state.searchConfig.config,
            [action.field]: action.value,
          },
        },
      };

    case "delete_search_config_key":
      return getPanelStateWithDeletedSearchConfigKey(state, action.keyToDelete);

    case "switch_dictionary":
      return switchDictionary(state);
    default:
      return null;
  }
};
