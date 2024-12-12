import { ReactNode, useContext, createContext } from "react";
import {
  EmitFnType,
  SubscribeFnType,
  UnsubscribeFnType,
} from "../types/apiDataChangeEventTypes";
import { PanelStateAction } from "../types/panel/panelStateActionTypes";

export interface PanelFunctionsType {
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
  subscribe: SubscribeFnType;
  unsubscribe: UnsubscribeFnType;
  emitAll: EmitFnType;
  emitInOtherPanel: EmitFnType;
}

export const PanelFunctionsContext = createContext<
  PanelFunctionsType | undefined
>(undefined);

export interface PanelFunctionsContextProviderArgs extends PanelFunctionsType {
  children: ReactNode;
}

export const PanelFunctionsContextProvider = ({
  children,
  dispatch,
  dispatchInOtherPanel,
  subscribe,
  unsubscribe,
  emitAll,
  emitInOtherPanel,
}: PanelFunctionsContextProviderArgs) => {
  return (
    <PanelFunctionsContext.Provider
      value={{
        dispatch,
        dispatchInOtherPanel,
        subscribe,
        unsubscribe,
        emitAll,
        emitInOtherPanel,
      }}
    >
      {children}
    </PanelFunctionsContext.Provider>
  );
};

export const usePanelFunctionsContext = () => {
  const context = useContext(PanelFunctionsContext);
  if (!context) {
    throw new Error(
      "usePanelFunctionsContext must be used within a context provider"
    );
  }
  return context;
};
