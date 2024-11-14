import { PanelTopBar } from "../panel-top-bar/PanelTopBar";

import {
  PanelState,
  PanelStateAction,
} from "@repo/shared/types/panelAndViewTypes";
import { ViewDispatchersContextProvider } from "../../../web-contexts/ViewDispatchersContext";
import { MainContent, MainContentArea } from "./MainContentArea";

interface PanelProps {
  state: PanelState;
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
}

export const Panel = ({
  state,
  dispatch,
  dispatchInOtherPanel,
}: PanelProps) => {
  return (
    <ViewDispatchersContextProvider
      dispatch={dispatch}
      dispatchInOtherPanel={dispatchInOtherPanel}
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
        <PanelTopBar state={state} dispatch={dispatch} />
        <div className="p-2 h-[90%] max-h-[90%] flex flex-1 flex-col overflow-y-scroll overflow-x-hidden">
          <MainContentArea
            scrollDistance={state.view.interactionData.scrollDistance}
            historyPointer={state.historyData.pointer}
          >
            <MainContent view={state.view} />
            <FooterArea />
          </MainContentArea>
        </div>
      </div>
    </ViewDispatchersContextProvider>
  );
};

const FooterArea = () => {
  return (
    <div
      style={{
        width: "75%",
        height: "2px",
        flexShrink: 0,
        backgroundColor: "#444444",
        marginLeft: "12.5%",
        marginRight: "12.5%",
        marginTop: "40px",
        marginBottom: "40px",
      }}
    />
  );
};
