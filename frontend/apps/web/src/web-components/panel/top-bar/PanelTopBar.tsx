import { SearchBarArea } from "./search-bar-area/SearchBarArea";
import { HistoryNavigationArea } from "./HistoryNavigationArea";
import { PanelState } from "@repo/shared/types/panel/panelTypes";
import { CloseButton } from "../../ui/CloseButton";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { memo } from "react";
import { JumpToViewButtonArea } from "./JumpToViewButtonArea";

export const PanelTopBar = ({ state }: { state: PanelState }) => {
  return (
    <div
      aria-label="panel-top-bar"
      className="flex flex-row h-12 min-h-12 mb-4 gap-4 w-full"
    >
      <div className="flex-none h-full">
        <JumpToViewButtonArea />
      </div>
      <div className="flex-1 h-full">
        <SearchBarArea searchConfig={state.searchConfig} />
      </div>
      <div className="flex flex-row h-full">
        <div className="h-full">
          <HistoryNavigationArea historyData={state.historyData} />
        </div>
        {/* width of x in button is 24 px */}
        <div className="w-6">
          <ClosePanelButton />
        </div>
      </div>
    </div>
  );
};

const ClosePanelButton = memo(() => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();
  return (
    <CloseButton
      onClick={() => panelDispatchStateChangeSelf({ type: "make_invisible" })}
      title="사전창 닫기"
    />
  );
});
