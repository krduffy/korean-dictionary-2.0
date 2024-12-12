import { ReactNode, useContext, createContext } from "react";
import {
  PanelFunctionsType,
  PersistentPanelData,
} from "./PersistentDictionaryPageStateContext";

export const PanelFunctionsContext = createContext<
  PanelFunctionsType | undefined
>(undefined);

export interface PanelFunctionsContextProviderArgs {
  children: ReactNode;
  panelData: PersistentPanelData;
}

export const PanelFunctionsContextProvider = ({
  children,
  panelData,
}: PanelFunctionsContextProviderArgs) => {
  return (
    <PanelFunctionsContext.Provider value={{ ...panelData }}>
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
