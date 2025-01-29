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
        flex flex-col h-full p-4 rounded-2xl 
        bg-[color:--background-secondary] 
        text-[color:--text-secondary] 
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
        border border-[color:--border-color]
        backdrop-blur-[12px] overflow-hidden"
      >
        {/* area for search bar and history navigation + closing panel */}
        <PanelTopBar state={panelData.state} />
        <PanelContent
          view={panelData.state.viewAndScrollDistance.view}
          scrollDistance={panelData.state.viewAndScrollDistance.scrollDistance}
          historyPointer={panelData.state.historyData.pointer}
        />
      </div>
    </PanelFunctionsContextProvider>
  );
});
