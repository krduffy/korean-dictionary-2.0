/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import {
  useDebouncedScrollUpdate,
  SCROLL_UPDATE_DEBOUNCE_TIME_MS,
} from "../useDebouncedScrollUpdate";

describe("useDebouncedScrollUpdate", () => {
  const mockPanelDispatchStateChangeSelf = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it("should dispatch scroll state change immediately if not debounced", () => {
    const { result } = renderHook(() =>
      useDebouncedScrollUpdate({
        panelDispatchStateChangeSelf: mockPanelDispatchStateChangeSelf,
      })
    );
    const { onScroll } = result.current;

    act(() => {
      const mockEvent = {
        currentTarget: { scrollTop: 100 },
      } as React.UIEvent<HTMLDivElement>;
      onScroll(mockEvent);
    });

    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledTimes(1);
    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledWith({
      type: "update_scroll_distance",
      scrollDistance: 100,
    });
  });

  it("should debounce scroll state changes and queue subsequent updates", () => {
    const { result } = renderHook(() =>
      useDebouncedScrollUpdate({
        panelDispatchStateChangeSelf: mockPanelDispatchStateChangeSelf,
      })
    );
    const { onScroll } = result.current;

    act(() => {
      const mockEvent = {
        currentTarget: { scrollTop: 100 },
      } as React.UIEvent<HTMLDivElement>;
      onScroll(mockEvent);
    });

    act(() => {
      const mockEvent = {
        currentTarget: { scrollTop: 200 },
      } as React.UIEvent<HTMLDivElement>;
      onScroll(mockEvent);
    });

    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledTimes(1);
    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledWith({
      type: "update_scroll_distance",
      scrollDistance: 100,
    });

    act(() => {
      jest.advanceTimersByTime(SCROLL_UPDATE_DEBOUNCE_TIME_MS);
    });

    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledTimes(2);
    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledWith({
      type: "update_scroll_distance",
      scrollDistance: 200,
    });
  });

  it("should not dispatch if no subsequent scroll updates occur", () => {
    const { result } = renderHook(() =>
      useDebouncedScrollUpdate({
        panelDispatchStateChangeSelf: mockPanelDispatchStateChangeSelf,
      })
    );
    const { onScroll } = result.current;

    act(() => {
      const mockEvent = {
        currentTarget: { scrollTop: 100 },
      } as React.UIEvent<HTMLDivElement>;
      onScroll(mockEvent);
    });

    act(() => {
      jest.advanceTimersByTime(SCROLL_UPDATE_DEBOUNCE_TIME_MS);
    });

    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledTimes(1);
    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledWith({
      type: "update_scroll_distance",
      scrollDistance: 100,
    });
  });

  it("should queue only the most recent scroll update during the debounce period", () => {
    const { result } = renderHook(() =>
      useDebouncedScrollUpdate({
        panelDispatchStateChangeSelf: mockPanelDispatchStateChangeSelf,
      })
    );
    const { onScroll } = result.current;

    act(() => {
      const mockEvent1 = {
        currentTarget: { scrollTop: 100 },
      } as React.UIEvent<HTMLDivElement>;
      const mockEvent2 = {
        currentTarget: { scrollTop: 200 },
      } as React.UIEvent<HTMLDivElement>;
      const mockEvent3 = {
        currentTarget: { scrollTop: 300 },
      } as React.UIEvent<HTMLDivElement>;

      onScroll(mockEvent1);
      onScroll(mockEvent2);
      onScroll(mockEvent3);
    });

    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledTimes(1);
    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledWith({
      type: "update_scroll_distance",
      scrollDistance: 100,
    });

    act(() => {
      jest.advanceTimersByTime(SCROLL_UPDATE_DEBOUNCE_TIME_MS);
    });

    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledTimes(2);
    expect(mockPanelDispatchStateChangeSelf).toHaveBeenCalledWith({
      type: "update_scroll_distance",
      scrollDistance: 300,
    });
  });
});
