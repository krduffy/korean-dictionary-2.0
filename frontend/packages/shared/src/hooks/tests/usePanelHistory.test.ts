/**
 * @jest-environment jsdom
 */
import { TestingView } from "../../types/panelAndViewTypes";
import { usePanelHistory } from "../usePanelHistory";
import { act, renderHook } from "@testing-library/react";

describe("usePanelHistory", () => {
  const smallStorageLimit = 2;

  const makeView = (id: number): TestingView => {
    return {
      type: "testing",
      id: id,
    };
  };

  const getViewId = (testingView: TestingView): number => {
    return testingView.id;
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
});
