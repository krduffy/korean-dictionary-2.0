/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useSpamProtectedSetter } from "../useSpamProtectedSetter";

describe("useSpamProtectedSetter", () => {
  const testData = {
    request1: {
      delay: 100,
      returned: 1,
    },
    request2: {
      delay: 1000,
      returned: 2,
    },
    request3: {
      delay: 500,
      returned: 3,
    },
  };

  const getRequestGetter = (
    requestNumber: RequestNumber
  ): (() => Promise<number>) => {
    const returned = testData[requestNumber].returned;
    const delay = testData[requestNumber].delay;

    return async () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(returned), delay)
      );
    };
  };

  type RequestNumber = "request1" | "request2" | "request3";

  /* used to simulate state in a react hook since getter cannot take any args */
  let globalRequestNumberState: RequestNumber = "request1";

  const getter = async (): Promise<number> => {
    return getRequestGetter(globalRequestNumberState)();
  };

  const objWithSetter = {
    setter: (value: number) => {
      // do nothing
    },
  };

  let setterSpy: jest.SpyInstance<void, [value: number], any>;

  beforeEach(() => {
    jest.useFakeTimers();
    setterSpy = jest.spyOn(objWithSetter, "setter");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /* even when i call request1 then request2, only request2 goes through */
  it("only sets on later call when earlier call resolves faster", async () => {
    const { result } = renderHook(() =>
      useSpamProtectedSetter({
        dataGetter: getter,
        setter: objWithSetter.setter,
      })
    );

    globalRequestNumberState = "request1";
    result.current();
    globalRequestNumberState = "request2";
    result.current();

    /* fast forward separately to let request 1 & 2 resolve */
    jest.advanceTimersByTime(testData.request1.delay);
    await jest.runAllTimersAsync();
    jest.advanceTimersByTime(testData.request2.delay);
    await jest.runAllTimersAsync();

    /* after waiting, setter should only have been called with data for request2 */

    expect(setterSpy).toHaveBeenCalledTimes(1);
    /* data from request 2 is the number 2 */
    expect(setterSpy).toHaveBeenCalledWith(2);
    expect(setterSpy).not.toHaveBeenCalledWith(1);
  });

  /* even when i call request2 then request3, request 2 does not change the state after
     data from request3 is written */
  it("does not set on earlier call when earlier call resolves slower", async () => {
    const { result } = renderHook(() =>
      useSpamProtectedSetter({
        dataGetter: getter,
        setter: objWithSetter.setter,
      })
    );

    globalRequestNumberState = "request2";
    result.current();
    globalRequestNumberState = "request3";
    result.current();

    /* fast forward separately to let request 3 & 2 resolve 
       ( 3 resolves before 2 ) */
    jest.advanceTimersByTime(testData.request3.delay);
    await jest.runAllTimersAsync();
    jest.advanceTimersByTime(testData.request2.delay);
    await jest.runAllTimersAsync();

    /* after waiting, setter should only have been called with data for request3 */

    expect(setterSpy).toHaveBeenCalledTimes(1);
    /* data from request 2 is the number 2 */
    expect(setterSpy).toHaveBeenCalledWith(3);
    expect(setterSpy).not.toHaveBeenCalledWith(2);
  });
});
