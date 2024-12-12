import { ReactNode, useContext, createContext, useReducer } from "react";
import {
  EmitFnType,
  SubscribeFnType,
  UnsubscribeFnType,
} from "../types/apiDataChangeEventTypes";
import { PanelStateAction } from "../types/panel/panelStateActionTypes";
import { HistoryData, PanelState } from "../types/panel/panelTypes";
import { SearchBarConfig } from "../types/views/searchConfigTypes";
import { View } from "../types/views/viewTypes";
import { getBasicKoreanSearchViewData } from "../utils/basicViews";
import { panelStateReducer } from "./panel-state-reducer/panelStateReducer";
import { useAPIDataChangeManager } from "../hooks/api/useAPIDataChangeManager";

export const PersistentDictionaryPageStateContext = createContext<
  PersistentDictionaryPageStateContextType | undefined
>(undefined);

export type PersistentPanelData = {
  state: PanelState;
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
  subscribe: SubscribeFnType;
  unsubscribe: UnsubscribeFnType;
  emitAll: EmitFnType;
  emitInOtherPanel: EmitFnType;
};

export interface PersistentDictionaryPageStateContextType {
  /** Data for the left panel. */
  leftPanelData: PersistentPanelData;
  /** Data for the right panel. */
  rightPanelData: PersistentPanelData;
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

  const {
    subscribe: leftSubscribe,
    unsubscribe: leftUnsubscribe,
    emit: leftEmit,
  } = useAPIDataChangeManager();
  const {
    subscribe: rightSubscribe,
    unsubscribe: rightUnsubscribe,
    emit: rightEmit,
  } = useAPIDataChangeManager();

  const emitAll = (...args: Parameters<typeof leftEmit>) => {
    leftEmit(...args);
    rightEmit(...args);
  };

  return (
    <PersistentDictionaryPageStateContext.Provider
      value={{
        leftPanelData: {
          state: leftState,
          dispatch: leftDispatch,
          dispatchInOtherPanel: rightDispatch,
          subscribe: leftSubscribe,
          unsubscribe: leftUnsubscribe,
          emitAll: emitAll,
          emitInOtherPanel: rightEmit,
        },
        rightPanelData: {
          state: rightState,
          dispatch: rightDispatch,
          dispatchInOtherPanel: leftDispatch,
          subscribe: rightSubscribe,
          unsubscribe: rightUnsubscribe,
          emitAll: emitAll,
          emitInOtherPanel: leftEmit,
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
