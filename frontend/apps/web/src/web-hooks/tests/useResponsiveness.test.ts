/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useResponsiveness } from "../useResponsiveness";

const resizeWindow = (width: number) => {
  (window.innerWidth as number) = width;
  window.dispatchEvent(new Event("resize"));
};

describe("useResponsiveness", () => {
  beforeAll(() => {
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("adds a resize event listener to window", () => {
    renderHook(() => useResponsiveness({ window: window }));

    expect(window.addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });

  it("returns true when window width is greater than or equal to 900", () => {
    resizeWindow(1000);

    const { result } = renderHook(() => useResponsiveness({ window: window }));

    expect(result.current.twoPanelsAllowed).toBe(true);
  });

  it("returns false when window width is less than 900", () => {
    resizeWindow(800);

    const { result } = renderHook(() => useResponsiveness({ window: window }));

    expect(result.current.twoPanelsAllowed).toBe(false);
  });

  it("updates twoPanelsAllowed on window resize", () => {
    resizeWindow(800);
    const { result } = renderHook(() => useResponsiveness({ window: window }));

    expect(result.current.twoPanelsAllowed).toBe(false);

    act(() => {
      resizeWindow(1000);
    });

    expect(result.current.twoPanelsAllowed).toBe(true);
  });

  it("removes event listener on unmount", () => {
    const { unmount } = renderHook(() => useResponsiveness({ window: window }));

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });

  describe("when window is undefined", () => {
    it("returns false when window is undefined", () => {
      const { result } = renderHook(() =>
        useResponsiveness({ window: undefined })
      );
      expect(result.current.twoPanelsAllowed).toBe(false);
    });

    it("does not create an event listener when window is undefined", () => {
      renderHook(() => useResponsiveness({ window: undefined }));

      expect(window.addEventListener).not.toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });
  });
});
