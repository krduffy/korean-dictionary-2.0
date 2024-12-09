import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { MoveLeft, MoveRight } from "lucide-react";

export const HistoryNavigationArea = ({
  dispatch,
}: {
  dispatch: React.Dispatch<PanelStateAction>;
}) => {
  return (
    <div className="h-full w-full flex flex-row">
      <NavigateBackButton onClick={() => dispatch({ type: "navigate_back" })} />

      <NavigateForwardButton
        onClick={() => dispatch({ type: "navigate_forward" })}
      />
    </div>
  );
};

const NavigateBackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="flex items-center justify-center w-10 h-10 
                 rounded-full bg-gray-100 text-gray-700 
                 hover:bg-gray-200 active:bg-gray-300 
                 border border-gray-300 shadow-sm 
                 transition-all duration-200"
      title="돌아가기"
      onClick={onClick}
    >
      <MoveLeft />
    </button>
  );
};

const NavigateForwardButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="w-full h-full" title="앞으로 가기" onClick={onClick}>
      <MoveRight />
    </button>
  );
};
