import { PanelStateAction } from "../../types/panel/panelStateActionTypes";
import { PanelState } from "../../types/panel/panelTypes";

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
        viewAndScrollDistance:
          state.historyData.viewsAndScrollDistances[
            state.historyData.pointer - 1
          ] ?? state.viewAndScrollDistance,
        historyData: {
          ...state.historyData,
          pointer: state.historyData.pointer - 1,
        },
      };

    case "navigate_forward":
      if (
        state.historyData.pointer >=
        state.historyData.viewsAndScrollDistances.length - 1
      ) {
        return state;
      }
      return {
        ...state,
        viewAndScrollDistance:
          state.historyData.viewsAndScrollDistances[
            state.historyData.pointer + 1
          ] ?? state.viewAndScrollDistance,
        historyData: {
          ...state.historyData,
          pointer: state.historyData.pointer + 1,
        },
      };

    default:
      return null;
  }
};
