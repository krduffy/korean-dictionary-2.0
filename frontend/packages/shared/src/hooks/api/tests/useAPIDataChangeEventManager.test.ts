/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useAPIDataChangeManager } from "../useAPIDataChangeManager";

describe("APIDataChangeEventManager", () => {
  it("notifies when a word is known", () => {
    const onNotification = jest.fn().mockImplementation((newKnown: boolean) => {
      return;
    });

    const { result } = renderHook(() => useAPIDataChangeManager());

    /* korean word (number pk) */
    act(() =>
      result.current.subscribe(1, {
        eventType: "known",
        onNotification: onNotification,
      })
    );

    /* when this is set to known */
    act(() =>
      result.current.emit(1, {
        eventType: "known",
        passToCallback: true,
      })
    );

    expect(onNotification).toHaveBeenCalledTimes(1);
    expect(onNotification).toHaveBeenCalledWith(true);
  });

  it("does not notify when an unapplicable event is emitted", () => {
    const onNotification = jest.fn().mockImplementation((newKnown: boolean) => {
      return;
    });

    const { result } = renderHook(() => useAPIDataChangeManager());

    /* korean word (number pk) */
    act(() =>
      result.current.subscribe(1, {
        eventType: "known",
        onNotification: onNotification,
      })
    );

    /* when this is set to studied */
    act(() =>
      result.current.emit(1, {
        eventType: "studied",
        passToCallback: true,
      })
    );

    /* listener is for setting to known so shouldnt have been fired */
    expect(onNotification).not.toHaveBeenCalled();
  });

  it("only notifies applicable event when more than one is subscribed", () => {
    const onNotificationToKoreanWord = jest
      .fn()
      .mockImplementation((newKnown: boolean) => {
        return;
      });
    const onNotificationToHanjaChar = jest
      .fn()
      .mockImplementation((newKnown: boolean) => {
        return;
      });

    const { result } = renderHook(() => useAPIDataChangeManager());

    /* korean word (number pk) */
    act(() =>
      result.current.subscribe(1, {
        eventType: "known",
        onNotification: onNotificationToKoreanWord,
      })
    );
    act(() =>
      result.current.subscribe("A", {
        eventType: "known",
        onNotification: onNotificationToHanjaChar,
      })
    );

    act(() =>
      result.current.emit("A", {
        eventType: "known",
        passToCallback: true,
      })
    );

    expect(onNotificationToKoreanWord).not.toHaveBeenCalled();
    expect(onNotificationToHanjaChar).toHaveBeenCalledTimes(1);
    expect(onNotificationToHanjaChar).toHaveBeenCalledWith(true);

    act(() =>
      result.current.emit(1, {
        eventType: "known",
        passToCallback: false,
      })
    );

    expect(onNotificationToKoreanWord).toHaveBeenCalledTimes(1);
    expect(onNotificationToKoreanWord).toHaveBeenCalledWith(false);
    // still only 1 time for hanja char from prev emission
    expect(onNotificationToHanjaChar).toHaveBeenCalledTimes(1);
  });

  it("only allows for the same data to be subscribed twice and receive separate notifications", () => {
    const { result } = renderHook(() => useAPIDataChangeManager());

    const onNotification = jest.fn().mockImplementation((newKnown: boolean) => {
      return;
    });

    /* korean word (number pk) */
    act(() =>
      result.current.subscribe(1, {
        eventType: "known",
        onNotification: onNotification,
      })
    );
    act(() =>
      result.current.subscribe(1, {
        eventType: "known",
        onNotification: onNotification,
      })
    );

    act(() =>
      result.current.emit(1, {
        eventType: "known",
        passToCallback: true,
      })
    );

    expect(onNotification).toHaveBeenCalledTimes(2);
    expect(onNotification).toHaveBeenCalledWith(true);
  });

  it("does not have race conditions with subscriptions under asynchronous conditions", async () => {
    const { result } = renderHook(() => useAPIDataChangeManager());
    const onNotification = jest.fn().mockImplementation((newKnown: boolean) => {
      return;
    });

    const addAsync = async (pk: number) => {
      act(() =>
        result.current.subscribe(pk, {
          eventType: "known",
          onNotification: onNotification,
        })
      );
    };

    const promises: Promise<void>[] = [];

    let pks: number[] = [];
    for (let i = 0; i < 100; i++) {
      pks.push(i % 20);
    }
    pks = pks
      .map((pk) => ({ pk: pk, order: Math.random() }))
      .sort((obj1, obj2) => obj1.order - obj2.order)
      .map((obj) => obj.pk);

    for (const pk of pks) {
      promises.push(
        new Promise((resolve) => {
          addAsync(pk).then(resolve);
        })
      );
    }

    await Promise.all(promises);

    for (let i = 0; i < 20; i++) {
      act(() =>
        result.current.emit(i, {
          eventType: "known",
          passToCallback: true,
        })
      );
      expect(onNotification).toHaveBeenCalledTimes(5 * (i + 1));
    }
  });

  it("allows for unsubscription", () => {
    const { result } = renderHook(() => useAPIDataChangeManager());

    const onNotification = jest.fn().mockImplementation((newKnown: boolean) => {
      return;
    });

    const listenerData = {
      eventType: "known",
      onNotification: onNotification,
    } as const;

    /* korean word (number pk) */
    act(() => result.current.subscribe(1, listenerData));
    act(() => result.current.unsubscribe(1, listenerData));

    /* when this is set to known */
    act(() =>
      result.current.emit(1, {
        eventType: "known",
        passToCallback: true,
      })
    );

    expect(onNotification).not.toHaveBeenCalled();
  });
});
