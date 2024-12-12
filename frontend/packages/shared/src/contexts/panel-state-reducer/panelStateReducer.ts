import { updateVisibilityIfApplicable } from "./visibilityActions";
import { pushIfApplicable } from "./pushActions";
import { updateConfigIfApplicable } from "./updateConfigActions";
import { updateHistoryPointerIfApplicable } from "./historyNavigationActions";
import { updatePageIfApplicable } from "./updatePageAction";
import { updateInteractionDataIfApplicable } from "./updateInteractionDataActions";
import { overwriteIfApplicable } from "./overwriteActions";
import { PanelState } from "../../types/panel/panelTypes";
import { View } from "../../types/views/viewTypes";
import { PanelStateAction } from "../../types/panel/panelStateActionTypes";

/* does not add or remove any views; only updates the current state of the current view */
export const updateViewAndHistory = (
  state: PanelState,
  updateFn: (view: View) => Partial<View>
): PanelState => {
  const updatedView: View = {
    ...state.view,
    ...updateFn(state.view),
  } as View;

  return {
    ...state,
    view: updatedView,
    historyData: {
      ...state.historyData,
      views: state.historyData.views.map((view, id) =>
        id === state.historyData.pointer
          ? {
              ...state.view,
              ...updateFn(state.view),
            }
          : view
      ) as View[],
    },
  };
};

export function panelStateReducer(
  state: PanelState,
  action: PanelStateAction
): PanelState {
  /* VISIBILITY: toggles for seeing and not seeing the panel */
  const updatedVisibility = updateVisibilityIfApplicable(state, action);
  if (updatedVisibility !== null) return updatedVisibility;

  /* PUSH VIEWS: add a new view to history and navigate to the new view. */
  const pushed = pushIfApplicable(state, action);
  if (pushed !== null) return pushed;

  /* UPDATE CONFIG: change the state of the search bar area's settings */
  const updatedConfig = updateConfigIfApplicable(state, action);
  if (updatedConfig !== null) return updatedConfig;

  /* Irrespective of the search bar but related to searching. Is set on a view-by-view basis 
       but still stored in search config in addition so that it can be restored when view
       is changed via history navigation but also easily passed into paginated results hook
       for appending search params to the url. => in a different file; treated differently */
  const updatedPage = updatePageIfApplicable(state, action);
  if (updatedPage !== null) return updatedPage;

  /* HISTORY NAVIGATION */
  const movedHistoryPtr = updateHistoryPointerIfApplicable(state, action);
  if (movedHistoryPtr !== null) return movedHistoryPtr;

  /* INTERACTION DATA SETTINGS */
  const updatedInteractionData = updateInteractionDataIfApplicable(
    state,
    action
  );
  if (updatedInteractionData !== null) return updatedInteractionData;

  /* Overwriting */
  const overwrote = overwriteIfApplicable(state, action);
  if (overwrote !== null) return overwrote;

  throw new Error("Unknown panel state action type");
}
