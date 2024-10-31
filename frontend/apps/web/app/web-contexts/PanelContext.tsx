"use client";

import React, { useState, ReactNode, useContext, createContext } from "react";
import { Panel } from "../web-components/dictionary-page/Panel";
import { getBasicKoreanSearchViewData } from "@repo/shared/utils/basicViews";

type PanelContextType = {
  leftPanel: ReactNode;
  setLeftPanel: (newPanel: ReactNode) => void;
  rightPanel: ReactNode;
  setRightPanel: (newPanel: ReactNode) => void;

  leftPanelVisible: boolean;
  setLeftPanelVisible: (newBool: boolean) => void;
  rightPanelVisible: boolean;
  setRightPanelVisible: (newBool: boolean) => void;
};

export const PanelContext = createContext<PanelContextType | undefined>(
  undefined
);

export const PanelContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  const initialPanelView = {
    type: "korean_search",
    data: getBasicKoreanSearchViewData(),
  };

  const [leftPanel, setLeftPanel] = useState<ReactNode>(
    <Panel
      initialView={initialPanelView}
      onClose={() => {
        setLeftPanelVisible(false);
      }}
    />
  );
  const [rightPanel, setRightPanel] = useState<ReactNode>(
    <Panel
      initialView={initialPanelView}
      onClose={() => {
        setRightPanelVisible(false);
      }}
    />
  );

  return (
    <PanelContext.Provider
      value={{
        leftPanel,
        setLeftPanel,
        rightPanel,
        setRightPanel,
        leftPanelVisible,
        setLeftPanelVisible,
        rightPanelVisible,
        setRightPanelVisible,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelContext = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error(
      "usePanelContext must be used within a PanelContextProvider"
    );
  }
  return context;
};
