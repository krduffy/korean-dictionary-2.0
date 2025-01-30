/**
 * @jest-environment jsdom
 */
import { it, describe, expect } from "@jest/globals";
import { View } from "../../types/views/viewTypes";
import { usePanelHistory } from "../usePanelHistory";
import { act, renderHook } from "@testing-library/react";

describe("usePanelHistory", () => {
  const smallStorageLimit = 2;

  const makeView = (id: number): View => {
    /* korean detail views are used because they are among the simplest */
    return {
      type: "korean_detail",
      data: {
        target_code: id,
      },
      /* not important */
      interactionData: {
        derivedLemmasDroppedDown: true,
        derivedLemmasPageNum: 1,
        userExampleDropdowns: {
          imagesDroppedDown: true,
          sentencesDroppedDown: true,
          userExamplesDroppedDown: true,
          videosDroppedDown: true,
        },
        sensesDroppedDown: true,
        detailedSenseDropdowns: [
          {
            additionalInfoBoxDroppedDown: true,
            exampleInfoDroppedDown: true,
            grammarInfoDroppedDown: true,
            normInfoDroppedDown: true,
            relationInfoDroppedDown: true,
            proverbInfoDroppedDown: true,
          },
        ],
        historyDroppedDown: true,
      },
    };
  };

  it("inits properly", () => {
    const view1 = makeView(1);

    const { result } = renderHook(() =>
      usePanelHistory({
        viewStorageLimit: smallStorageLimit,
        initialView: view1,
      })
    );

    let canNavigateBack;
    let canNavigateForward;
    let followingView;
    let precedingView;

    act(() => {
      canNavigateBack = result.current.canNavigateBack();
      canNavigateForward = result.current.canNavigateForward();
      followingView = result.current.navigateForward();
      precedingView = result.current.navigateBack();
    });

    expect(canNavigateBack).toBe(false);
    expect(canNavigateForward).toBe(false);
    expect(followingView).toEqual(null);
    expect(precedingView).toEqual(null);
  });

  it("pushes a view to history and advances to it", () => {
    const view1 = makeView(1);
    const view2 = makeView(2);

    const { result } = renderHook(() =>
      usePanelHistory({
        viewStorageLimit: smallStorageLimit,
        initialView: view1,
      })
    );

    let currentView;

    act(() => {
      result.current.pushViewToHistory(view2);
      currentView = result.current.getCurrentView();
    });

    expect(currentView).toEqual(view2);
  });

  it("can navigate back and forth", () => {
    const view1 = makeView(1);
    const view2 = makeView(2);

    const { result } = renderHook(() =>
      usePanelHistory({
        viewStorageLimit: smallStorageLimit,
        initialView: view1,
      })
    );

    let currentView;

    act(() => {
      result.current.pushViewToHistory(view2);
      currentView = result.current.getCurrentView();
    });

    expect(currentView).toEqual(view2);
    expect(result.current.canNavigateBack()).toBe(true);
    expect(result.current.canNavigateForward()).toBe(false);

    act(() => {
      currentView = result.current.navigateBack();
    });

    expect(currentView).toEqual(view1);

    act(() => {
      currentView = result.current.navigateBack();
    });

    expect(currentView).toBeNull();

    act(() => {
      currentView = result.current.navigateForward();
    });

    /* having navigate backwards when not possible should not have changed pointer */
    expect(currentView).toEqual(view2);

    act(() => {
      currentView = result.current.navigateForward();
    });

    expect(currentView).toBeNull();
  });

  it("removes the first element when view storage limit is reached", () => {
    const view1 = makeView(1);
    const view2 = makeView(2);
    const view3 = makeView(3);

    const { result } = renderHook(() =>
      usePanelHistory({
        viewStorageLimit: smallStorageLimit,
        initialView: view1,
      })
    );

    result.current.pushViewToHistory(view2);
    result.current.pushViewToHistory(view3);

    /* storage limit is 2 so the first view should have been removed when view3 was added */
    expect(result.current.getCurrentView()).toEqual(view3);
    expect(result.current.navigateBack()).toEqual(view2);
    expect(result.current.navigateBack()).toBeNull();
  });

  it("updates a view in history correctly", () => {
    const view1 = makeView(1);
    const view2 = makeView(2);
    const view3 = makeView(3);

    const { result } = renderHook(() =>
      usePanelHistory({
        viewStorageLimit: smallStorageLimit,
        initialView: view1,
      })
    );

    result.current.updateCurrentViewInHistory(view3);
    result.current.pushViewToHistory(view2);
    /* (not view1) */
    expect(result.current.navigateBack()).toEqual(view3);
  });

  it("correctly returns canNavigateBack and canNavigateForward values", () => {
    const view1 = makeView(1);
    const view2 = makeView(2);

    const { result } = renderHook(() =>
      usePanelHistory({
        viewStorageLimit: smallStorageLimit,
        initialView: view1,
      })
    );

    expect(result.current.canNavigateBack()).toBe(false);
    expect(result.current.canNavigateForward()).toBe(false);

    result.current.pushViewToHistory(view2);
    expect(result.current.canNavigateBack()).toBe(true);
    expect(result.current.canNavigateForward()).toBe(false);

    result.current.navigateBack();
    expect(result.current.canNavigateBack()).toBe(false);
    expect(result.current.canNavigateForward()).toBe(true);
  });
});
