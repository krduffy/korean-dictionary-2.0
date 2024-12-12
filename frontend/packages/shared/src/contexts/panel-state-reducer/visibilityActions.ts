import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { PanelState } from "@repo/shared/types/panel/panelTypes";

export const updateVisibilityIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "make_visible":
      return {
        ...state,
        visible: true,
      };
    case "make_invisible":
      return {
        ...state,
        visible: false,
      };
    default:
      return null;
  }
};
