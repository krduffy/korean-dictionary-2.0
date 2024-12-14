import { PanelState } from "src/types/panel/panelTypes";
import { updateViewAndHistory } from "./panelStateReducer";
import { View } from "src/types/views/viewTypes";
import { PanelStateAction } from "src/types/panel/panelStateActionTypes";
import { DetailedSenseDropdownState } from "src/types/views/interactionDataTypes";

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

const getWithUpdatedKoreanDetailedSenseDropdowns = (
  state: PanelState,
  senseNumber: number,
  dropdownKey: keyof DetailedSenseDropdownState,
  newIsDroppedDown: boolean
): PanelState => {
  if (state.view.type != "korean_detail") {
    return state;
  }

  const newDropdowns = state.view.interactionData.detailedSenseDropdowns.map(
    (currentSenseDropdownsObj, index) =>
      index === senseNumber
        ? { ...currentSenseDropdownsObj, [dropdownKey]: newIsDroppedDown }
        : currentSenseDropdownsObj
  );

  return updateInteractionData(state, "detailedSenseDropdowns", newDropdowns);
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
      return getWithUpdatedKoreanDetailedSenseDropdowns(
        state,
        action.senseNumber,
        action.dropdownKey,
        action.newIsDroppedDown
      );

    case "update_korean_detail_interaction_data":
      return updateInteractionData(state, action.key, action.newValue);

    case "update_hanja_detail_interaction_data":
      return updateInteractionData(state, action.key, action.newValue);

    default:
      return null;
  }
};
