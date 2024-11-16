import { useState } from "react";
import { View, ViewType } from "../types/panelAndViewTypes";

export type UsePanelHistoryArgs = {
  viewStorageLimit: number;
  initialView: View;
};

export const usePanelHistory = ({
  viewStorageLimit,
  initialView,
}: UsePanelHistoryArgs) => {
  /*
   * History is stored as an array of views.
   * [{"view: "homepage}, {"view": "search_korean", "value": "가다"}, ...] for example
   */
  const [history, setHistory] = useState<View[]>([initialView]);

  /*
   * historyPointer is the index of the current view in history.
   * If history is composed of views v0, v1, v2, with historyPointer set at v2, click back will move
   * historyPointer to v1.
   *
   *   v0   v1   v2
   *        ^
   *       ptr
   *
   * If a new view v3 is then rendered, history will overwrite v2 and become:
   *
   *   v0   v1   v3
   *             ^
   *            ptr
   */
  const [historyPointer, setHistoryPointer] = useState<number>(0);

  /**
   * Adds a new view to the history.
   */
  const pushViewToHistory = (newView: View) => {
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push(newView);
    setHistory(newHistory);
    setHistoryPointer(historyPointer + 1);
  };

  /**
   * Retrieves the preceding view in the history and updates the history pointer. If the history
   * pointer is at the first item in history, `null` is returned and the history pointer is
   * not changed.
   */
  const navigateBack = (): View | null => {
    if (!canNavigateBack()) {
      return null;
    }

    const prevPointer = historyPointer;
    setHistoryPointer(prevPointer - 1);
    return history[prevPointer - 1] ?? null;
  };

  /**
   * Retrieves the next view in history and updates the history pointer. If the history
   * pointer is at the last item in history, `null` is returned and the history pointer is
   * not changed.
   */
  const navigateForward = (): View | null => {
    if (!canNavigateForward()) {
      return null;
    }

    const prevPointer = historyPointer;
    setHistoryPointer(prevPointer + 1);
    return history[prevPointer + 1] ?? null;
  };

  /**
   * Checks if navigation back is possible based on the current history pointer.
   */
  const canNavigateBack = (): boolean => {
    return historyPointer - 1 >= 0;
  };

  /**
   * Checks if navigation forward is possible based on the current history pointer.
   */
  const canNavigateForward = (): boolean => {
    return historyPointer + 1 <= history.length - 1;
  };

  /**
   * Updates the current view in the history with a new view.
   */
  const updateCurrentViewInHistory = (newView: View) => {
    let newHistory = history.slice(0, history.length);
    newHistory[historyPointer] = newView;
    setHistory(newHistory);
  };

  /* these were in the original but will (likely) not be in this ver */

  /*
  const navigateToLastViewOfType = (viewType: ViewType): View => {
    for (let i = historyPointer; i >= 0; i--) {
      if (history[i]?.type === viewType) {
        setHistoryPointer(i);
        return history[i] || initialView;
      }
    }

    return initialView;
  };

  /*
  const findMostRecentInHistoryOfType = (viewType) => {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].view === viewType) {
        setHistoryPointer(i);
        return history[i];
      }
    }

    return null;
  };
  */

  return {
    pushViewToHistory,
    canNavigateBack,
    navigateBack,
    canNavigateForward,
    navigateForward,
    updateCurrentViewInHistory,
  };
};
