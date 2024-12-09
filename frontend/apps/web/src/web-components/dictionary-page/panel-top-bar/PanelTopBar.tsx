import { SearchBarArea } from "./search-bar-area/SearchBarArea";
import { HistoryNavigationArea } from "./HistoryNavigationArea";
import { SpanPicture } from "../../other/string-formatters/SpanStylers";
import { PanelState } from "@repo/shared/types/panel/panelTypes";
import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";

export const PanelTopBar = ({
  state,
  dispatch,
}: {
  state: PanelState;
  dispatch: React.Dispatch<PanelStateAction>;
}) => {
  return (
    <div className="flex flex-row h-12 mb-4">
      <div className="w-[80%]">
        <SearchBarArea searchConfig={state.searchConfig} dispatch={dispatch} />
      </div>
      <div className="w-[20%] flex flex-row">
        <div className="w-[80%] h-full">
          <HistoryNavigationArea dispatch={dispatch} />
        </div>
        <div className="w-[20%]">
          <CloseButton onClose={() => dispatch({ type: "make_invisible" })} />
        </div>
      </div>
    </div>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      className="h-[33%] w-full flex items-center justify-center"
      title="간판을 닫기"
      onClick={onClose}
    >
      <SpanPicture string="✖" />
    </button>
  );
};
