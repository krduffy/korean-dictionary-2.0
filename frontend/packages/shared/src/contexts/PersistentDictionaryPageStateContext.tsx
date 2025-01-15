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
import { useAPIDataChangeManager } from "../hooks/listener-handlers/useAPIDataChangeManager";

export const PersistentDictionaryPageStateContext = createContext<
  PersistentDictionaryPageStateContextType | undefined
>(undefined);

/**
 * Functions that operate on the panels of the dictionary page. They are either called on
 * the panel that is a parent of the calling component/hook (functions end with `Self`) or
 * on the other panel (functions end in `Other`).
 */
export interface PanelFunctionsType {
  /** Dispatches a state change in the calling panel. */
  panelDispatchStateChangeSelf: React.Dispatch<PanelStateAction>;
  /** Dispatches a state change in other panel. */
  panelDispatchStateChangeOther: React.Dispatch<PanelStateAction>;
  /** Subscribes the calling panel to an api data change event. */
  panelSubscribeSelf: SubscribeFnType;
  /** Unsubscribes the calling panel from an api data change event. */
  panelUnsubscribeSelf: UnsubscribeFnType;
  /** Emits an api data change event in the calling panel. */
  panelEmitSelf: EmitFnType;
  /** Emits an api data change event in the other panel. */
  panelEmitOther: EmitFnType;
}

export interface PersistentPanelData extends PanelFunctionsType {
  state: PanelState;
}

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
    type: "panel_homepage",
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

  return (
    <PersistentDictionaryPageStateContext.Provider
      value={{
        leftPanelData: {
          state: leftState,
          panelDispatchStateChangeSelf: leftDispatch,
          panelDispatchStateChangeOther: rightDispatch,
          panelSubscribeSelf: leftSubscribe,
          panelUnsubscribeSelf: leftUnsubscribe,
          panelEmitSelf: leftEmit,
          panelEmitOther: rightEmit,
        },
        rightPanelData: {
          state: rightState,
          panelDispatchStateChangeSelf: rightDispatch,
          panelDispatchStateChangeOther: leftDispatch,
          panelSubscribeSelf: rightSubscribe,
          panelUnsubscribeSelf: rightUnsubscribe,
          panelEmitSelf: rightEmit,
          panelEmitOther: leftEmit,
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
