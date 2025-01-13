import { SearchBarArea } from "./search-bar-area/SearchBarArea";
import { HistoryNavigationArea } from "./HistoryNavigationArea";
import { PanelState } from "@repo/shared/types/panel/panelTypes";
import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { CloseButton } from "../../ui/CloseButton";

export const PanelTopBar = ({
  state,
  panelDispatchStateChangeSelf,
}: {
  state: PanelState;
  panelDispatchStateChangeSelf: React.Dispatch<PanelStateAction>;
}) => {
  return (
    <div className="flex flex-row h-12 mb-4 gap-4">
      <div className="flex-1">
        <SearchBarArea
          searchConfig={state.searchConfig}
          panelDispatchStateChangeSelf={panelDispatchStateChangeSelf}
        />
      </div>
      <div className="flex flex-row">
        <div className="h-full">
          <HistoryNavigationArea
            historyData={state.historyData}
            panelDispatchStateChangeSelf={panelDispatchStateChangeSelf}
          />
        </div>
        {/* width of x in button is 24 px */}
        <div className="w-6">
          <CloseButton
            onClick={() =>
              panelDispatchStateChangeSelf({ type: "make_invisible" })
            }
            title="사전창 닫기"
          />
        </div>
      </div>
    </div>
  );
};
