import { PanelTopBar } from "./top-bar/PanelTopBar";
import { memo } from "react";
import { PersistentPanelData } from "@repo/shared/contexts/PersistentDictionaryPageStateContext";
import { PanelFunctionsContextProvider } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { PanelContent } from "./PanelContent";

export const Panel = memo((panelData: PersistentPanelData) => {
  return (
    <PanelFunctionsContextProvider panelData={panelData}>
      <div
        className="
        flex flex-col h-full bg-[color:--background-secondary] text-[color:--text-secondary] 
        p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/20
        backdrop-blur-[12px] overflow-hidden"
      >
        {/* area for search bar and history navigation + closing panel */}
        <PanelTopBar
          state={panelData.state}
          panelDispatchStateChangeSelf={panelData.panelDispatchStateChangeSelf}
        />
        <div className="p-2 h-[90%] max-h-[90%] flex flex-1 flex-col overflow-y-scroll overflow-x-hidden">
          <PanelContent
            view={panelData.state.view}
            scrollDistance={panelData.state.view.interactionData.scrollDistance}
            historyPointer={panelData.state.historyData.pointer}
          />
        </div>
      </div>
    </PanelFunctionsContextProvider>
  );
});
