import { PanelStateAction } from "../../types/panel/panelStateActionTypes";
import { PanelState } from "../../types/panel/panelTypes";
import { View } from "../../types/views/viewTypes";
import { updateViewAndHistory } from "./panelStateReducer";

const getWithUpdatedPage = (state: PanelState, newPage: number): PanelState => {
  if (
    state.view.type !== "hanja_search" &&
    state.view.type !== "korean_search"
  ) {
    return state;
  }

  const updateFn = (currentView: View): Partial<View> => {
    return {
      data: {
        ...currentView.data,
        page: newPage,
      },
    } as View;
  };

  return updateViewAndHistory(state, updateFn);
};

export const updatePageIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "update_page":
      return getWithUpdatedPage(state, action.newPage);

    default:
      return null;
  }
};
