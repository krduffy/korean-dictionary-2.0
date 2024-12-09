import { ReactNode, useContext, createContext, useReducer } from "react";
import { getBasicKoreanSearchViewData } from "@repo/shared/utils/basicViews";
import { panelStateReducer } from "./panel-state-reducer/panelStateReducer";
import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { HistoryData, PanelState } from "@repo/shared/types/panel/panelTypes";
import { View } from "@repo/shared/types/views/viewTypes";
import { SearchBarConfig } from "@repo/shared/types/views/searchConfigTypes";

export const PersistentDictionaryPageStateContext = createContext<
  PersistentDictionaryPageStateContextType | undefined
>(undefined);

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

  const initialSearchConfig: SearchBarConfig = {
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
