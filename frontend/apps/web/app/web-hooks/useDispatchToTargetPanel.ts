import { PanelStateAction } from "@repo/shared/types/panelAndViewTypes";

export const useDispatchToTargetPanel = ({
  dispatch,
  dispatchInOtherPanel,
}: {
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
}) => {
  const dispatchToTargetPanel = (
    e: React.MouseEvent,
    action: PanelStateAction
  ) => {
    e.preventDefault();

    const notSelf = e.ctrlKey || e.button === 2;
    console.log(notSelf);

    if (notSelf) {
      dispatchInOtherPanel(action);
      dispatchInOtherPanel({ type: "make_visible" });
    } else {
      dispatch(action);
    }
  };

  return {
    dispatchToTargetPanel,
  };
};
