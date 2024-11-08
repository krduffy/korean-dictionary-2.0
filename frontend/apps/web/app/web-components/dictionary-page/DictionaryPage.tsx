"use client";

import React from "react";
import { usePersistentDictionaryPageStateContext } from "../../web-contexts/PersistentDictionaryPageStateContext";
import { PageWithNavBar } from "./navbar/PageWithNavBar";

import { Panel } from "./Panel";

export const DictionaryPage = () => {
  const { leftPanelData, rightPanelData } =
    usePersistentDictionaryPageStateContext();

  const leftPanelVisible = leftPanelData.state.visible;
  const rightPanelVisible = rightPanelData.state.visible;

  const makeLeftVisible = () =>
    leftPanelData.dispatch({ type: "make_visible" });
  const makeRightVisible = () =>
    rightPanelData.dispatch({ type: "make_visible" });

  return (
    <PageWithNavBar>
      <>
        {/* Neither panel is visible. */}
        {!leftPanelVisible && !rightPanelVisible ? (
          <div className="h-full grid grid-cols-2">
            <div className="col-span-1 flex items-center justify-center">
              <PanelToggler onAdd={makeLeftVisible} />
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <PanelToggler onAdd={makeRightVisible} />
            </div>
          </div>
        ) : /* Only the right panel is visible */
        !leftPanelVisible && rightPanelVisible ? (
          <div className="h-full grid grid-cols-4">
            <div className="col-start-1 col-end-2 flex items-center justify-center">
              <PanelToggler onAdd={makeLeftVisible} />
            </div>
            <div className="col-start-2 col-end-4 h-full overflow-hidden">
              {/* RIGHT PANEL */}
              <Panel
                state={rightPanelData.state}
                dispatch={rightPanelData.dispatch}
                dispatchInOtherPanel={rightPanelData.dispatchInOtherPanel}
              />
            </div>
          </div>
        ) : /* Only the left panel is visible */
        leftPanelVisible && !rightPanelVisible ? (
          <div className="h-full grid grid-cols-4">
            <div className="col-start-2 col-end-4 bg-background h-full overflow-hidden">
              {/* LEFT PANEL */}
              <Panel
                state={leftPanelData.state}
                dispatch={leftPanelData.dispatch}
                dispatchInOtherPanel={leftPanelData.dispatchInOtherPanel}
              />
            </div>
            <div className="col-start-4 col-end-5 flex items-center justify-center">
              <PanelToggler onAdd={makeRightVisible} />
            </div>
          </div>
        ) : (
          /* Both panels are visible. */
          <div className="h-full grid grid-cols-2">
            <div className="col-span-1 mr-2 h-full overflow-hidden">
              {/* LEFT PANEL */}
              <Panel
                state={leftPanelData.state}
                dispatch={leftPanelData.dispatch}
                dispatchInOtherPanel={leftPanelData.dispatchInOtherPanel}
              />
            </div>
            <div className="col-span-1 ml-2 h-full overflow-hidden">
              {/* RIGHT PANEL */}
              <Panel
                state={rightPanelData.state}
                dispatch={rightPanelData.dispatch}
                dispatchInOtherPanel={rightPanelData.dispatchInOtherPanel}
              />
            </div>
          </div>
        )}
      </>
    </PageWithNavBar>
  );
};

const PanelToggler = ({ onAdd }: { onAdd: () => void }) => {
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
