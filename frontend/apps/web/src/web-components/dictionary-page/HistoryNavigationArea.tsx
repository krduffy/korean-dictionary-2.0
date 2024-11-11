import { PanelStateAction } from "@repo/shared/types/panelAndViewTypes";
import { SpanPicture } from "../misc/SpanPicture";

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
    <button className="w-[50%] h-full" title="돌아가기" onClick={onClick}>
      <SpanPicture string="←" />
    </button>
  );
};

const NavigateForwardButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="w-[50%] h-full hover:text-blue-500 transition-colors duration-200"
      title="앞으로 가기"
      onClick={onClick}
    >
      <SpanPicture string="→" />
    </button>
  );
};
