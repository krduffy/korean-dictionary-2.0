import { SearchBarArea } from "./search-bar-area/SearchBarArea";
import { HistoryNavigationArea } from "./HistoryNavigationArea";
import { PanelState } from "@repo/shared/types/panel/panelTypes";
import { CloseButton } from "../../ui/CloseButton";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { memo } from "react";

export const PanelTopBar = ({ state }: { state: PanelState }) => {
  return (
    <div className="flex flex-row h-12 mb-4 gap-4">
      <div className="flex-1">
        <SearchBarArea searchConfig={state.searchConfig} />
      </div>
      <div className="flex flex-row">
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
