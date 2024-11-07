import { PanelStateAction } from "@repo/shared/types/panelAndViewTypes";
import { ReactNode, useContext, createContext } from "react";

export interface ViewDispatchersType {
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
}

export const ViewDispatchersContext = createContext<
  ViewDispatchersType | undefined
>(undefined);

export interface ViewDispatchersContextProviderArgs
  extends ViewDispatchersType {
  children: ReactNode;
}

export const ViewDispatchersContextProvider = ({
  children,
  dispatch,
  dispatchInOtherPanel,
}: ViewDispatchersContextProviderArgs) => {
  return (
    <ViewDispatchersContext.Provider
      value={{
        dispatch: dispatch,
        dispatchInOtherPanel: dispatchInOtherPanel,
      }}
    >
      {children}
    </ViewDispatchersContext.Provider>
  );
};

export const useViewDispatchersContext = () => {
  const context = useContext(ViewDispatchersContext);
  if (!context) {
    throw new Error(
      "useViewDispatchersContext must be used within a context provider"
    );
  }
  return context;
};
