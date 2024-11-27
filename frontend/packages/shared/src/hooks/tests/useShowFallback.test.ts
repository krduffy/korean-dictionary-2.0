/**
 * @jest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react";
import { useShowFallback } from "../useShowFallback";
import { FALLBACK_MAX_TIME_MS, FALLBACK_MIN_TIME_MS } from "../../constants";

describe("useShowFallback", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * Expectations:
   * 1) Make request => inited properly and timers started
   * 2) For fallbackMinTimeMs milliseconds, loading is faked no matter what
   * 3) After that point, if successful becomes true, fallback is not shown
   * 4) After fallbackMaxTimeMs milliseconds, loading is no longer faked no matter what
   */

  it("overwrites show fallback on early canceller true", () => {
    const { result, rerender } = renderHook(
      () =>
        useShowFallback({
          earlyCanceller: false,
          fallbackMinTimeMs: FALLBACK_MIN_TIME_MS,
          fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
        }),
      {
        initialProps: {
          earlyCanceller: false,
        },
      }
    );

    act(() => result.current.resetFallbackTimers());

    expect(result.current.showFallback).toBe(true);

    /* 2) For fallbackMinTimeMs milliseconds, fallback is still shown */
    act(() => {
      jest.advanceTimersByTime(FALLBACK_MIN_TIME_MS - 20);
    });
    expect(result.current.showFallback).toBe(true);

    /* 3) After fallbackMinTimeMs milliseconds, if earlyCanceller becomes true, 
          fallback is not shown */
    act(() => {
      jest.advanceTimersByTime(20);
      jest.runAllTimers();
    });
    act(() => rerender({ earlyCanceller: true }));
    expect(result.current.showFallback).toBe(false);

    /* 4) After fallbackMaxTimeMs milliseconds, fallback is no longer shown no matter what */
    act(() => {
      jest.advanceTimersByTime(FALLBACK_MAX_TIME_MS - FALLBACK_MIN_TIME_MS);
    });
    expect(result.current.showFallback).toBe(false);
  });

  it("overwrites show fallback on elapsing of fallbackMaxTimeMs", () => {
    const { result } = renderHook(
      () =>
        useShowFallback({
          earlyCanceller: false,
          fallbackMinTimeMs: FALLBACK_MIN_TIME_MS,
          fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
        }),
      {
        initialProps: {
          earlyCanceller: false,
        },
      }
    );

    act(() => result.current.resetFallbackTimers());

    expect(result.current.showFallback).toBe(true);

    /* 2) For fallbackMinTimeMs milliseconds, fallback is still shown */
    act(() => {
      jest.advanceTimersByTime(FALLBACK_MIN_TIME_MS - 20);
    });
    expect(result.current.showFallback).toBe(true);

    /* 3) After fallbackMinTimeMs milliseconds, if earlyCanceller becomes true, 
          fallback is not shown */
    act(() => {
      jest.advanceTimersByTime(20);
    });
    /* value of earlyCanceller was not set to true, so the fallback should still be shown */
    expect(result.current.showFallback).toBe(true);

    /* 4) Before fallbackMaxTimeMs milliseconds, fallback is still shown */
    act(() => {
      jest.advanceTimersByTime(
        FALLBACK_MAX_TIME_MS - FALLBACK_MIN_TIME_MS - 20
      );
    });
    expect(result.current.showFallback).toBe(true);

    /* 5) After fallbackMaxTimeMs milliseconds, fallback is no longer shown */
    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(result.current.showFallback).toBe(false);
  });
});
