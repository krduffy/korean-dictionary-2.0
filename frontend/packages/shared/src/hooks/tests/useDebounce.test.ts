/**
 * @jest-environment jsdom
 */
import { useDebounce } from "../useDebounce";
import { GET_REQUEST_DEBOUNCE_TIME_MS } from "../../constants";
import { renderHook } from "@testing-library/react";

describe("useDebounce", () => {
  let val: number = 0;
  let func: () => void;

  beforeEach(() => {
    jest.useFakeTimers();
    val = 0;
    const { result } = renderHook(() =>
      useDebounce(() => {
        val++;
      })
    );
    func = result.current;
  });

  it("blocks when time between calls is too short", async () => {
    const totalTime = GET_REQUEST_DEBOUNCE_TIME_MS / 2;
    const calls = 10;

    for (let i = 0; i < calls; i++) {
      func();
      jest.advanceTimersByTime(totalTime / calls);
    }

    jest.runAllTimers();

    /* only one call should have gone through */
    expect(val).toEqual(1);
  });
});
