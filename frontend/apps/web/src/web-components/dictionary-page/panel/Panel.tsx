import { PanelTopBar } from "../panel-top-bar/PanelTopBar";
import { MainContent, MainContentArea } from "./MainContentArea";
import { memo } from "react";
import { LineBreakArea } from "../../other/misc/LineBreakArea";
import { PersistentPanelData } from "@repo/shared/contexts/PersistentDictionaryPageStateContext";
import { PanelFunctionsContextProvider } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const Panel = memo((panelData: PersistentPanelData) => {
  return (
    <PanelFunctionsContextProvider
      dispatch={panelData.dispatch}
      dispatchInOtherPanel={panelData.dispatchInOtherPanel}
      subscribe={panelData.subscribe}
      unsubscribe={panelData.unsubscribe}
      emitAll={panelData.emitAll}
      emitInOtherPanel={panelData.emitInOtherPanel}
    >
      <div
        className="flex flex-col h-full bg-[color:--background-secondary] text-[color:--text-secondary] p-4 
    rounded-2xl
    shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20
    backdrop-blur-[12px]
    overflow-hidden
"
      >
        {/* area for search bar and history navigation + closing panel */}
        <PanelTopBar state={panelData.state} dispatch={panelData.dispatch} />
        <div className="p-2 h-[90%] max-h-[90%] flex flex-1 flex-col overflow-y-scroll overflow-x-hidden">
          <MainContentArea
            scrollDistance={panelData.state.view.interactionData.scrollDistance}
            historyPointer={panelData.state.historyData.pointer}
          >
            <MainContent view={panelData.state.view} />
            <LineBreakArea marginSize={20} />
          </MainContentArea>
        </div>
      </div>
    </PanelFunctionsContextProvider>
  );
});
