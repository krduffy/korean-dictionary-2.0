import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { PanelState } from "@repo/shared/types/panel/panelTypes";

export const updateHistoryPointerIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "navigate_back":
      if (state.historyData.pointer < 0) {
        return state;
      }
      return {
        ...state,
        view:
          state.historyData.views[state.historyData.pointer - 1] ?? state.view,
        historyData: {
          ...state.historyData,
          pointer: state.historyData.pointer - 1,
        },
      };

    case "navigate_forward":
      if (state.historyData.pointer >= state.historyData.views.length - 1) {
        return state;
      }
      return {
        ...state,
        view:
          state.historyData.views[state.historyData.pointer + 1] ?? state.view,
        historyData: {
          ...state.historyData,
          pointer: state.historyData.pointer + 1,
        },
      };

    default:
      return null;
  }
};
