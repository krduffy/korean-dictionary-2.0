import { createContext, ReactNode, useContext } from "react";
import { UseAPIDataChangeManagerReturns } from "../types/apiDataChangeEventTypes";
import { useAPIDataChangeManager } from "../hooks/api/useAPIDataChangeManager";

export const APIDataChangeManagerContext =
  createContext<UseAPIDataChangeManagerReturns | null>(null);

export const APIDataChangeManagerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { subscribe, unsubscribe, emit } = useAPIDataChangeManager();

  return (
    <APIDataChangeManagerContext.Provider
      value={{ subscribe, unsubscribe, emit }}
    >
      {children}
    </APIDataChangeManagerContext.Provider>
  );
};

export const useAPIDataChangeManagerContext = () => {
  const context = useContext(APIDataChangeManagerContext);
  if (context === null) {
    throw new Error(
      "useAPIDataChangeManagerContext must be called from within a context provider."
    );
  }
  return context;
};
