import { PanelState } from "../../types/panel/panelTypes";
import { updateViewAndHistory } from "./panelStateReducer";
import { View } from "../../types/views/viewTypes";
import { PanelStateAction } from "../../types/panel/panelStateActionTypes";
import {
  BaseInteractionData,
  DetailedSenseDropdownState,
  HanjaDetailInteractionData,
  KoreanDetailInteractionData,
} from "../../types/views/interactionDataTypes";
import { getDefaultDetailedSenseDropdowns } from "../../utils/basicViews";

const updateInteractionData = <T extends BaseInteractionData>(
  state: PanelState,
  key: keyof T,
  newValue: T[keyof T]
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

  return updateInteractionData<KoreanDetailInteractionData>(
    state,
    "detailedSenseDropdowns",
    newDropdowns
  );
};

const updateDetailedSenseDropdownsLength = (
  state: PanelState,
  newLength: number
) => {
  if (state.view.type !== "korean_detail") return state;

  const detailedSenseDropdowns =
    state.view.interactionData.detailedSenseDropdowns;

  return updateInteractionData<KoreanDetailInteractionData>(
    state,
    "detailedSenseDropdowns",
    Array(newLength)
      .fill(null)
      .map((_, id) => {
        return detailedSenseDropdowns[id] || getDefaultDetailedSenseDropdowns();
      })
  );
};

export const updateInteractionDataIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "update_scroll_distance":
      return updateInteractionData<BaseInteractionData>(
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

    case "update_detailed_sense_dropdown_states_length":
      return updateDetailedSenseDropdownsLength(state, action.newLength);

    case "update_hanja_detail_interaction_data":
      return updateInteractionData<HanjaDetailInteractionData>(
        state,
        action.key,
        action.newValue
      );

    default:
      return null;
  }
};
