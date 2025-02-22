import { PanelState } from "../../types/panel/panelTypes";
import { updateViewAndHistory } from "./panelStateReducer";
import { View } from "../../types/views/viewTypes";
import { PanelStateAction } from "../../types/panel/panelStateActionTypes";
import {
  BaseInteractionData,
  DerivedExampleTextInteractionData,
  DetailedSenseDropdownState,
  HanjaDetailInteractionData,
  KoreanDetailInteractionData,
  KoreanDetailUserExampleDropdownState,
  KoreanUserExampleEditInteractionData,
} from "../../types/views/interactionDataTypes";
import { getDefaultDetailedSenseDropdowns } from "../../utils/basicViews";

const updateInteractionData = <
  InteractionDataType extends BaseInteractionData,
  Key extends keyof InteractionDataType,
>(
  state: PanelState,
  key: Key,
  newValue: InteractionDataType[Key]
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
  if (state.viewAndScrollDistance.view.type != "korean_detail") {
    return state;
  }

  const newDropdowns =
    state.viewAndScrollDistance.view.interactionData.detailedSenseDropdowns.map(
      (currentSenseDropdownsObj, index) =>
        index === senseNumber
          ? { ...currentSenseDropdownsObj, [dropdownKey]: newIsDroppedDown }
          : currentSenseDropdownsObj
    );

  return updateInteractionData<
    KoreanDetailInteractionData,
    "detailedSenseDropdowns"
  >(state, "detailedSenseDropdowns", newDropdowns);
};

const updateDetailedSenseDropdownsLength = (
  state: PanelState,
  newLength: number
) => {
  if (state.viewAndScrollDistance.view.type !== "korean_detail") return state;

  const detailedSenseDropdowns =
    state.viewAndScrollDistance.view.interactionData.detailedSenseDropdowns;

  return updateInteractionData<
    KoreanDetailInteractionData,
    "detailedSenseDropdowns"
  >(
    state,
    "detailedSenseDropdowns",
    Array(newLength)
      .fill(null)
      .map((_, id) => {
        return detailedSenseDropdowns[id] || getDefaultDetailedSenseDropdowns();
      })
  );
};

const updateUserExampleDropdownState = (
  state: PanelState,
  key: keyof KoreanDetailUserExampleDropdownState,
  newValue: boolean
) => {
  if (state.viewAndScrollDistance.view.type !== "korean_detail") return state;

  return updateInteractionData<
    KoreanDetailInteractionData,
    "userExampleDropdowns"
  >(state, "userExampleDropdowns", {
    ...state.viewAndScrollDistance.view.interactionData.userExampleDropdowns,
    [key]: newValue,
  });
};

const updateScrollDistance = (
  state: PanelState,
  scrollDistance: number
): PanelState => {
  return {
    ...state,
    viewAndScrollDistance: {
      view: state.viewAndScrollDistance.view,
      scrollDistance: scrollDistance,
    },
    historyData: {
      ...state.historyData,
      viewsAndScrollDistances: state.historyData.viewsAndScrollDistances.map(
        (item, id) =>
          id === state.historyData.pointer
            ? {
                ...item,
                scrollDistance: scrollDistance,
              }
            : item
      ),
    },
  };
};

export const updateInteractionDataIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "update_scroll_distance":
      return updateScrollDistance(state, action.scrollDistance);

    case "update_korean_detail_dropdown_toggle":
      return getWithUpdatedKoreanDetailedSenseDropdowns(
        state,
        action.senseNumber,
        action.dropdownKey,
        action.newIsDroppedDown
      );

    case "update_korean_detail_interaction_data":
      return updateInteractionData<
        KoreanDetailInteractionData,
        typeof action.key
      >(state, action.key, action.newValue);

    case "update_detailed_sense_dropdown_states_length":
      return updateDetailedSenseDropdownsLength(state, action.newLength);

    case "update_korean_detail_user_example_interaction_data":
      return updateUserExampleDropdownState(state, action.key, action.newValue);

    case "update_hanja_detail_interaction_data":
      return updateInteractionData<
        HanjaDetailInteractionData,
        typeof action.key
      >(state, action.key, action.newValue);

    case "update_derived_example_text_interaction_data":
      return updateInteractionData<
        DerivedExampleTextInteractionData,
        typeof action.key
      >(state, action.key, action.newValue);

    case "update_korean_user_example_edit_interaction_data":
      return updateInteractionData<
        KoreanUserExampleEditInteractionData,
        typeof action.key
      >(state, action.key, action.newValue);

    default:
      return null;
  }
};
