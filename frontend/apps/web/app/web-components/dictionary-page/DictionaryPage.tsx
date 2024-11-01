"use client";

import React from "react";
import {
  PanelSelfContextProvider,
  usePanelContext,
} from "../../web-contexts/PanelContext";
import { NavBar } from "./navbar/NavBar";

const PanelWrappedWithSelfContext = ({
  panel,
  updateSelfInMemory,
}: {
  panel: React.ReactNode;
  updateSelfInMemory: (self: React.ReactNode) => void;
}) => {
  return (
    <PanelSelfContextProvider updateSelfInMemory={updateSelfInMemory}>
      {panel}
    </PanelSelfContextProvider>
  );
};

export const DictionaryPage = () => {
  const {
    leftPanel,
    setLeftPanel,
    rightPanel,
    setRightPanel,
    leftPanelVisible,
    setLeftPanelVisible,
    rightPanelVisible,
    setRightPanelVisible,
  } = usePanelContext();

  return (
    <div className="h-full p-3">
      <div className="h-[10%]">
        <NavBar />
      </div>
      {/* Neither panel is visible. */}
      <div className="h-[90%]">
        {!leftPanelVisible && !rightPanelVisible ? (
          <div className="h-full grid grid-cols-2">
            <div className="col-span-1 flex items-center justify-center">
              <PanelToggler onAdd={() => setLeftPanelVisible(true)} />
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <PanelToggler onAdd={() => setRightPanelVisible(true)} />
            </div>
          </div>
        ) : /* Only the right panel is visible */
        !leftPanelVisible && rightPanelVisible ? (
          <div className="h-full grid grid-cols-4">
            <div className="col-start-1 col-end-2 flex items-center justify-center">
              <PanelToggler onAdd={() => setLeftPanelVisible(true)} />
            </div>
            <div className="col-start-2 col-end-4">
              <PanelWrappedWithSelfContext
                panel={rightPanel}
                updateSelfInMemory={setRightPanel}
              />
            </div>
          </div>
        ) : /* Only the left panel is visible */
        leftPanelVisible && !rightPanelVisible ? (
          <div className="h-full grid grid-cols-4">
            <div className="col-start-2 col-end-4 bg-background">
              <PanelWrappedWithSelfContext
                panel={leftPanel}
                updateSelfInMemory={setLeftPanel}
              />
            </div>
            <div className="col-start-4 col-end-5 flex items-center justify-center">
              <PanelToggler onAdd={() => setRightPanelVisible(true)} />
            </div>
          </div>
        ) : (
          /* Both panels are visible. */
          <div className="h-full grid grid-cols-2">
            <div className="col-span-1 mr-2">
              <PanelWrappedWithSelfContext
                panel={leftPanel}
                updateSelfInMemory={setLeftPanel}
              />
            </div>
            <div className="col-span-1 ml-2">
              <PanelWrappedWithSelfContext
                panel={rightPanel}
                updateSelfInMemory={setRightPanel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PanelToggler = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="w-12 h-12 rounded-full bg-[color:--button-color] flex 
      items-center justify-center hover:bg-[color:--button-hover-color] 
      transition-colors"
    >
      <span className="text-3xl text-[color:--text-primary]-600 leading-none">
        +
      </span>
    </button>
  );
};

export default DictionaryPage;
