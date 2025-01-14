import { useAPIDataChangeManager } from "../hooks/listener-handlers/useAPIDataChangeManager";
import {
  EmitFnType,
  SubscribeFnType,
  UnsubscribeFnType,
} from "../types/apiDataChangeEventTypes";
import { createContext, ReactNode, useContext } from "react";

export type GlobalFunctions = {
  globalSubscribe: SubscribeFnType;
  globalUnsubscribe: UnsubscribeFnType;
  globalEmit: EmitFnType;
};

const GlobalFunctionsContext = createContext<GlobalFunctions | undefined>(
  undefined
);

export const GlobalFunctionsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { subscribe, unsubscribe, emit } = useAPIDataChangeManager();

  return (
    <GlobalFunctionsContext.Provider
      value={{
        globalSubscribe: subscribe,
        globalUnsubscribe: unsubscribe,
        globalEmit: emit,
      }}
    >
      {children}
    </GlobalFunctionsContext.Provider>
  );
};

export const useGlobalFunctionsContext = () => {
  const context = useContext(GlobalFunctionsContext);

  if (!context) {
    throw new Error(
      "useGlobalFunctionsContext must be called from within a context provider."
    );
  }

  return context;
};
