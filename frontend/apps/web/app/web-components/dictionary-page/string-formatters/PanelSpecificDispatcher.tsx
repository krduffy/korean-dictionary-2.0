import { PanelStateAction } from "@repo/shared/types/panelAndViewTypes";

type PanelSpecificDispatcherArgs = {
  children: React.ReactNode;
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
  panelStateAction: PanelStateAction;
};

export const PanelSpecificDispatcher = ({
  children,
  dispatch,
  dispatchInOtherPanel,
  panelStateAction,
}: PanelSpecificDispatcherArgs) => {
  const dispatchToTargetPanel = (
    e: React.MouseEvent<HTMLSpanElement>,
    action: PanelStateAction
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const notSelf = e.ctrlKey || e.button === 2;

    if (notSelf) {
      dispatchInOtherPanel(action);
      dispatchInOtherPanel({ type: "make_visible" });
    } else {
      dispatch(action);
    }
  };

  const onContextMenu = (
    e: React.MouseEvent<HTMLSpanElement>,
    panelStateAction: PanelStateAction
  ) => {
    e.preventDefault();
    dispatchToTargetPanel(e, panelStateAction);
  };

  return (
    <span
      onClick={(e) => dispatchToTargetPanel(e, panelStateAction)}
      onContextMenu={(e) => onContextMenu(e, panelStateAction)}
    >
      {children}
    </span>
  );
};
