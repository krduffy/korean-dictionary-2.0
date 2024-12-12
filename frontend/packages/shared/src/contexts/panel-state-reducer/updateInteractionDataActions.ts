import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { PanelState } from "@repo/shared/types/panel/panelTypes";
import { View } from "@repo/shared/types/views/viewTypes";
import { updateViewAndHistory } from "./panelStateReducer";

const updateInteractionData = (
  state: PanelState,
  key: string,
  newValue: any
) => {
  /* type guards */

  const updateFn = (currentView: View): Partial<View> => {
    return {
      interactionData: {
        ...currentView.interactionData,
        [key]: newValue,
      },
    };
  };

  return updateViewAndHistory(state, updateFn);
};

const getWithUpdatedKoreanDetailDropdowns = (
  state: PanelState,
  id: number,
  newIsDroppedDown: boolean
): PanelState => {
  if (state.view.type != "korean_detail") {
    return state;
  }

  const newDropdowns = state.view.interactionData.dropdowns.map(
    (current, index) => (index === id ? newIsDroppedDown : current)
  );

  return updateInteractionData(state, "dropdowns", newDropdowns);
};

export const updateInteractionDataIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "update_scroll_distance":
      return updateInteractionData(
        state,
        "scrollDistance",
        action.scrollDistance
      );

    case "update_korean_detail_dropdown_toggle":
      return getWithUpdatedKoreanDetailDropdowns(
        state,
        action.id,
        action.newIsDroppedDown
      );

    case "update_hanja_detail_interaction_data":
      return updateInteractionData(state, action.key, action.newValue);

    default:
      return null;
  }
};
