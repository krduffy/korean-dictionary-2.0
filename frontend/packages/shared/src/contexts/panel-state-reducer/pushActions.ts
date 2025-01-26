import { getDefaultDetailedSenseDropdowns } from "../../utils/basicViews";
import { PanelStateAction } from "../../types/panel/panelStateActionTypes";
import { PanelState } from "../../types/panel/panelTypes";
import { View } from "../../types/views/viewTypes";

/* adds a new view to the end of history */
const pushView = (state: PanelState, newView: View): PanelState => {
  const trimmedViews = state.historyData.views.slice(
    0,
    state.historyData.pointer + 1
  );
  // if already positioned at the last item in history then need to make cut of the first index
  // in views
  const cutFirst = trimmedViews.length >= state.historyData.maxLength;
  const baseViewArray = cutFirst
    ? state.historyData.views.slice(1)
    : trimmedViews;

  return {
    ...state,
    view: newView,
    historyData: {
      ...state.historyData,
      views: baseViewArray.concat([newView]),
      pointer: cutFirst
        ? state.historyData.pointer
        : state.historyData.pointer + 1,
    },
  };
};

export const pushIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "push_korean_search":
      return pushView(state, {
        ...state.view,
        type: "korean_search",
        data: {
          ...action.searchConfig,
          page: 1,
        },
        interactionData: {
          scrollDistance: 0,
        },
      });
    case "push_hanja_search":
      return pushView(state, {
        ...state.view,
        type: "hanja_search",
        data: {
          ...action.searchConfig,
          page: 1,
        },
        interactionData: {
          scrollDistance: 0,
        },
      });
    case "push_korean_detail":
      return pushView(state, {
        ...state.view,
        type: "korean_detail",
        data: { target_code: action.target_code },
        interactionData: {
          scrollDistance: 0,
          /* 30 is used tentatively as the max number of senses supported */
          historyDroppedDown: true,
          sensesDroppedDown: true,
          detailedSenseDropdowns: Array(40).fill(
            getDefaultDetailedSenseDropdowns()
          ),
          derivedLemmasDroppedDown: true,
          derivedLemmasPageNum: 1,
          userExampleDropdowns: {
            userExamplesDroppedDown: true,
            imagesDroppedDown: true,
            sentencesDroppedDown: true,
            videosDroppedDown: true,
          },
        },
      });
    case "push_hanja_detail":
      return pushView(state, {
        ...state.view,
        type: "hanja_detail",
        data: { character: action.character },
        interactionData: {
          explanationDroppedDown: true,
          exampleWordsDroppedDown: true,
          exampleWordsPageNum: 1,
          scrollDistance: 0,
        },
      });
    case "push_find_lemma":
      return pushView(state, {
        ...state.view,
        type: "find_lemma",
        data: {
          word: action.word,
          sentence: action.sentence,
          index: action.index,
        },
        interactionData: {
          scrollDistance: 0,
        },
      });

    default:
      return null;
  }
};
