"use client";

import { ReactNode, useContext, createContext, useReducer } from "react";
import {
  getBasicHanjaSearchViewData,
  getBasicKoreanSearchViewData,
} from "@repo/shared/utils/basicViews";
import {
  HistoryData,
  PanelState,
  PanelStateAction,
  SearchConfig,
  View,
} from "@repo/shared/types/panelAndViewTypes";

export const PersistentDictionaryPageStateContext = createContext<
  PersistentDictionaryPageStateContextType | undefined
>(undefined);

const getPanelStateAfterPush = (state: PanelState, newView: View) => {
  const trimmedViews = state.historyData.views.slice(
    0,
    state.historyData.pointer + 1
  );
  // if already positioned at the last item in history then need to make cut of the first index
  // in views
  const cutFirst = trimmedViews.length >= state.historyData.maxLength;
  const baseViewArray = cutFirst
    ? state.historyData.views.slice(1)
    : trimmedViews;

  return {
    ...state,
    view: newView,
    historyData: {
      ...state.historyData,
      views: baseViewArray.concat([newView]),
      pointer: cutFirst
        ? state.historyData.pointer
        : state.historyData.pointer + 1,
    },
  };
};

export function panelStateReducer(
  state: PanelState,
  action: PanelStateAction
): PanelState {
  switch (action.type) {
    /* VISIBILITY: toggles for seeing and not seeing the panel */
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

    /* PUSH VIEWS: add a new view to history and navigate to the new view. */
    case "push_korean_search":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "korean_search",
        data: {
          ...action.searchConfig,
          page: 1,
        },
      });
    case "push_hanja_search":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "hanja_search",
        data: {
          ...action.searchConfig,
          page: 1,
        },
      });
    case "push_korean_detail":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "korean_detail",
        data: { target_code: action.target_code },
      });
    case "push_hanja_detail":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "hanja_detail",
        data: { character: action.character },
      });

    /* UPDATE CONFIG: change the state of the search bar area's settings */
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

    /* HISTORY NAVIGATION */
    case "navigate_back":
      if (state.historyData.pointer < 0) {
        return state;
      }
      return {
        ...state,
        view:
          state.historyData.views[state.historyData.pointer - 1] ?? state.view,
        historyData: {
          ...state.historyData,
          pointer: state.historyData.pointer - 1,
        },
      };
    case "navigate_forward":
      if (state.historyData.pointer >= state.historyData.views.length - 1) {
        return state;
      }
      return {
        ...state,
        view:
          state.historyData.views[state.historyData.pointer + 1] ?? state.view,
        historyData: {
          ...state.historyData,
          pointer: state.historyData.pointer + 1,
        },
      };
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

  const initialHistoryData: HistoryData = {
    views: [initialPanelView],
    pointer: 0,
    maxLength: 10,
  };

  const [leftState, leftDispatch] = useReducer(panelStateReducer, {
    visible: true,
    searchConfig: initialSearchConfig,
    view: initialPanelView,
    historyData: initialHistoryData,
  });

  const [rightState, rightDispatch] = useReducer(panelStateReducer, {
    visible: false,
    searchConfig: initialSearchConfig,
    view: initialPanelView,
    historyData: initialHistoryData,
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
      "usePersistentDictionaryPageStateContext must be used within a context provider"
    );
  }
  return context;
};
