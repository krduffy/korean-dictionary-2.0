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

const getWithUpdatedScrollDistance = (
  state: PanelState,
  newScrollDistance: number
): PanelState => {
  if (newScrollDistance < 0) {
    return state;
  }

  return {
    ...state,
    view: {
      ...state.view,
      interactionData: {
        ...state.view.interactionData,
        scrollDistance: newScrollDistance,
      },
    } as View,
    /* also needs to be updated in history so scroll distance can be restored. */
    historyData: {
      ...state.historyData,
      views: state.historyData.views.map((view, index) => {
        if (index != state.historyData.pointer) {
          return view;
        }

        return {
          ...view,
          interactionData: {
            ...view.interactionData,
            scrollDistance: newScrollDistance,
          },
        } as View;
      }),
    },
  };
};

const getWithUpdatedPage = (state: PanelState, newPage: number): PanelState => {
  if (
    state.view.type !== "hanja_search" &&
    state.view.type !== "korean_search"
  ) {
    return state;
  }

  return {
    ...state,
    view: {
      ...state.view,
      data: {
        ...state.view.data,
        page: newPage,
      },
    } as View,
    historyData: {
      ...state.historyData,
      views: state.historyData.views.map((view, id) => {
        if (id !== state.historyData.pointer) {
          return view;
        }

        return {
          ...view,
          data: {
            ...view.data,
            page: newPage,
          },
        };
      }) as View[],
    },
  };
};

const getWithUpdatedKoreanDetailDropdowns = (
  state: PanelState,
  id: number,
  newIsDroppedDown: boolean
): PanelState => {
  if (state.view.type != "korean_detail") {
    return state;
  }

  return {
    ...state,
    view: {
      ...state.view,
      interactionData: {
        ...state.view.interactionData,
        dropdowns: state.view.interactionData.dropdowns.map(
          (current, index) => {
            return index === id ? newIsDroppedDown : current;
          }
        ),
      },
    },
    historyData: {
      ...state.historyData,
      views: state.historyData.views.map((view, index) => {
        if (
          index != state.historyData.pointer ||
          view.type != "korean_detail"
        ) {
          return view;
        }

        return {
          ...view,
          interactionData: {
            ...view.interactionData,
            dropdowns: view.interactionData.dropdowns.map((current, index) => {
              return index === id ? newIsDroppedDown : current;
            }),
          },
        } as View;
      }),
    },
  };
};

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
    } as SearchConfig,
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
        interactionData: {
          scrollDistance: 0,
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
        interactionData: {
          scrollDistance: 0,
        },
      });
    case "push_korean_detail":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "korean_detail",
        data: { target_code: action.target_code },
        interactionData: {
          scrollDistance: 0,
          dropdowns: Array(30).fill(false),
        },
      });
    case "push_hanja_detail":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "hanja_detail",
        data: { character: action.character },
        interactionData: {
          scrollDistance: 0,
        },
      });
    case "push_find_lemma":
      return getPanelStateAfterPush(state, {
        ...state.view,
        type: "find_lemma",
        data: {
          word: action.word,
          sentence: action.sentence,
        },
        interactionData: {
          scrollDistance: 0,
        },
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

    case "delete_search_config_key":
      return getPanelStateWithDeletedSearchConfigKey(state, action.keyToDelete);

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

    /* Irrespective of the search bar but related to searching. Is set on a view-by-view basis */
    case "update_page":
      return getWithUpdatedPage(state, action.newPage);

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

    /* INTERACTION DATA SETTINGS */
    case "update_scroll_distance":
      return getWithUpdatedScrollDistance(state, action.scrollDistance);
    case "update_korean_detail_dropdown_toggle":
      return getWithUpdatedKoreanDetailDropdowns(
        state,
        action.id,
        action.newIsDroppedDown
      );

    default:
      throw Error("Unknown type");
  }
}

export interface PersistentDictionaryPageStateContextType {
  /** Data for the left panel. */
  leftPanelData: {
    state: PanelState;
    dispatch: React.Dispatch<PanelStateAction>;
    dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
  };
  /** Data for the right panel. */
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
    interactionData: {
      scrollDistance: 0,
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
