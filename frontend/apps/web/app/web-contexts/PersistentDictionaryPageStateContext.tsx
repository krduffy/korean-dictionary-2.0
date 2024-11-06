"use client";

import React, { ReactNode, useContext, createContext, useReducer } from "react";
import {
  getBasicHanjaSearchViewData,
  getBasicKoreanSearchViewData,
} from "@repo/shared/utils/basicViews";
import {
  PanelState,
  PanelStateAction,
  SearchConfig,
  View,
} from "@repo/shared/types/panelAndViewTypes";

export const PersistentDictionaryPageStateContext = createContext<
  PersistentDictionaryPageStateContextType | undefined
>(undefined);

export function panelStateReducer(
  state: PanelState,
  action: PanelStateAction
): PanelState {
  switch (action.type) {
    case "make_visible":
      return {
        ...state,
        visible: true,
      };
    case "make_invisible":
      return {
        ...state,
        visible: false,
      };
    case "push_korean_search":
      return {
        ...state,
        view: {
          ...state.view,
          type: "korean_search",
          data: {
            ...action.searchConfig,
            page: 1,
          },
        },
      };
    case "push_hanja_search":
      return {
        ...state,
        view: {
          ...state.view,
          type: "hanja_search",
          data: {
            ...action.searchConfig,
            page: 1,
          },
        },
      };
    case "push_korean_detail":
      return {
        ...state,
        view: {
          ...state.view,
          type: "korean_detail",
          data: { target_code: action.target_code },
        },
      };
    case "push_hanja_detail":
      return {
        ...state,
        view: {
          ...state.view,
          type: "hanja_detail",
          data: { character: action.character },
        },
      };
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

    case "switch_dictionary":
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
    default:
      throw Error("Unknown type");
  }
}

export interface PersistentDictionaryPageStateContextType {
  leftPanelData: {
    state: PanelState;
    dispatch: React.Dispatch<PanelStateAction>;
    dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
  };
  rightPanelData: {
    state: PanelState;
    dispatch: React.Dispatch<PanelStateAction>;
    dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
  };
}

export const PersistentDictionaryPageStateContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const initialPanelView: View = {
    type: "korean_search",
    data: {
      ...getBasicKoreanSearchViewData({ searchTerm: "" }),
      page: 1,
    },
  } as const;

  const initialSearchConfig: SearchConfig = {
    dictionary: "korean",
    config: getBasicKoreanSearchViewData({ searchTerm: "" }),
  } as const;

  const [leftState, leftDispatch] = useReducer(panelStateReducer, {
    visible: true,
    searchConfig: initialSearchConfig,
    view: initialPanelView,
  });

  const [rightState, rightDispatch] = useReducer(panelStateReducer, {
    visible: false,
    searchConfig: initialSearchConfig,
    view: initialPanelView,
  });

  return (
    <PersistentDictionaryPageStateContext.Provider
      value={{
        leftPanelData: {
          state: leftState,
          dispatch: leftDispatch,
          dispatchInOtherPanel: rightDispatch,
        },
        rightPanelData: {
          state: rightState,
          dispatch: rightDispatch,
          dispatchInOtherPanel: leftDispatch,
        },
      }}
    >
      {children}
    </PersistentDictionaryPageStateContext.Provider>
  );
};

export const usePersistentDictionaryPageStateContext = () => {
  const context = useContext(PersistentDictionaryPageStateContext);
  if (!context) {
    throw new Error(
      "usePersistentDictionaryPageStateContext must be used within a PanelPersistentDictionaryPageStateContextProvider"
    );
  }
  return context;
};
