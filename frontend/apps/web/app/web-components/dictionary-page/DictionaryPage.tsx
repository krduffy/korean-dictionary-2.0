"use client";

import React from "react";
import { usePanelContext } from "../../web-contexts/PanelContext";

export const DictionaryPage = () => {
  const {
    leftPanel,
    rightPanel,
    leftPanelVisible,
    setLeftPanelVisible,
    rightPanelVisible,
    setRightPanelVisible,
  } = usePanelContext();

  return (
    <div className="h-full">
      {
        /* Neither panel is visible. */
        !leftPanelVisible && !rightPanelVisible ? (
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
            <div className="col-start-2 col-end-4 border-4 border-white bg-background">
              {rightPanel}
            </div>
          </div>
        ) : /* Only the left panel is visible */
        leftPanelVisible && !rightPanelVisible ? (
          <div className="h-full grid grid-cols-4">
            <div className="col-start-2 col-end-4 border-4 border-white bg-background">
              {leftPanel}
            </div>
            <div className="col-start-4 col-end-5 flex items-center justify-center">
              <PanelToggler onAdd={() => setRightPanelVisible(true)} />
            </div>
          </div>
        ) : (
          /* Both panels are visible. */
          <div className="h-full grid grid-cols-2">
            <div className="col-span-1 border-4 bg-[color:--background-secondary]">
              {leftPanel}
            </div>
            <div className="col-span-1 border-4 bg-[color:--background-secondary]">
              {rightPanel}
            </div>
          </div>
        )
      }
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
