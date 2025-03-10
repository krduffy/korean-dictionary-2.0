import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { HistoryData } from "@repo/shared/types/panel/panelTypes";
import { LucideIcon, MoveLeft, MoveRight } from "lucide-react";
import { memo } from "react";

export const HistoryNavigationArea = ({
  historyData,
}: {
  historyData: HistoryData;
}) => {
  const canNavigateBackwards = historyData.pointer !== 0;
  const canNavigateForwards =
    historyData.pointer < historyData.viewsAndScrollDistances.length - 1;

  return (
    <div className="h-full w-full flex flex-row gap-2">
      <NavigateBackButton canNavigateBackwards={canNavigateBackwards} />
      <NavigateForwardButton canNavigateForwards={canNavigateForwards} />
    </div>
  );
};

const NavigateBackButton = memo(
  ({ canNavigateBackwards }: { canNavigateBackwards: boolean }) => {
    const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

    return (
      <HistoryNavigationButton
        Icon={MoveLeft}
        title="돌아가기"
        onClick={() => panelDispatchStateChangeSelf({ type: "navigate_back" })}
        enabled={canNavigateBackwards}
      />
    );
  }
);

const NavigateForwardButton = memo(
  ({ canNavigateForwards }: { canNavigateForwards: boolean }) => {
    const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

    return (
      <HistoryNavigationButton
        Icon={MoveRight}
        title="앞으로 가기"
        onClick={() =>
          panelDispatchStateChangeSelf({ type: "navigate_forward" })
        }
        enabled={canNavigateForwards}
      />
    );
  }
);

const HistoryNavigationButton = ({
  Icon,
  title,
  onClick,
  enabled,
}: {
  Icon: LucideIcon;
  title: string;
  onClick: () => void;
  enabled: boolean;
}) => {
  const enabledStyles = "cursor-pointer";
  const disabledStyles = "cursor-not-allowed bg-[color:--";

  return (
    <button
      className={`flex items-center justify-center w-10 h-10 
                  rounded-full
                  text-[color:--button-text-color]
                  bg-[color:--button-color] hover:bg-[color:--button-hover-color]
                  border border-[color:--border-color] shadow-sm 
                  transition-all duration-200 
                  ${enabled ? enabledStyles : disabledStyles}`}
      title={title}
      onClick={() => {
        if (enabled) onClick();
      }}
    >
      <Icon />
    </button>
  );
};
