import { PanelStateAction } from "src/types/panel/panelStateActionTypes";
import { PanelState } from "src/types/panel/panelTypes";
import { View } from "src/types/views/viewTypes";

/* completely removes the current view and puts a new one in its place */
const overwriteCurrentView = (state: PanelState, newView: View): PanelState => {
  const trimmedViews = state.historyData.views.slice(
    0,
    state.historyData.pointer
  );

  return {
    ...state,
    view: newView,
    historyData: {
      ...state.historyData,
      views: trimmedViews.concat([newView]),
    },
  };
};

const getWithInitializedSearchKorean = (state: PanelState, word: string) => {
  const newView: View = {
    type: "korean_search",
    data: {
      search_term: word,
      search_type: "word_exact",
      page: 1,
    },
    interactionData: {
      scrollDistance: 0,
    },
  };

  return overwriteCurrentView(state, newView);
};

export const overwriteIfApplicable = (
  state: PanelState,
  action: PanelStateAction
): PanelState | null => {
  switch (action.type) {
    case "push_find_lemma_success":
      return getWithInitializedSearchKorean(state, action.word);

    default:
      return null;
  }
};
