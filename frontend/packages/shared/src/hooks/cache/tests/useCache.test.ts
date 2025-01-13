/**
 * @jest-environment jsdom
 */

import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import { useCache } from "../useCache";
import { UseCacheArgs } from "src/types/cacheTypes";

describe("useCache", () => {
  const baseCapacity = 2;
  const baseGlobalSubscribe = jest.fn();
  const baseGlobalUnsubscribe = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
  });

  const doRenderHook = (args: Partial<UseCacheArgs>) =>
    renderHook(() =>
      useCache({
        capacity: baseCapacity,
        globalSubscribe: baseGlobalSubscribe,
        globalUnsubscribe: baseGlobalUnsubscribe,
        ...args,
      })
    );

  it("correctly puts and fetches a url", () => {
    const { result } = doRenderHook({});

    const url = "url";
    const response = { data: 1 };

    act(() => {
      result.current.put({ url: url, response: response, ok: true });
    });

    let fromCache: any = null;

    act(() => {
      fromCache = result.current.retrieve(url);
    });

    expect(fromCache).not.toBe(null);
    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual(response);
  });

  it("correctly differentiates between different bodies and identical urls", () => {
    const { result } = doRenderHook({});

    const url = "url";

    const body1 = JSON.stringify({ s: "s1" });
    const body2 = JSON.stringify({ s: "s2" });

    const response1 = { data: 1 };
    const response2 = { data: 2 };

    act(() => {
      result.current.put({
        url: url,
        response: response1,
        ok: true,
        body: body1,
      });
      result.current.put({
        url: url,
        response: response2,
        ok: true,
        body: body2,
      });
    });

    let fromCache: any = null;

    act(() => {
      fromCache = result.current.retrieve(url);
    });

    /* should be nothing since the key in the cache also uses body if it is sent */
    expect(fromCache).toBe(null);

    act(() => {
      fromCache = result.current.retrieve(url, body1);
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual(response1);
    expect(fromCache.response).not.toEqual(response2);

    act(() => {
      fromCache = result.current.retrieve(url, body2);
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual(response2);
    expect(fromCache.response).not.toEqual(response1);
  });

  it("deletes the first item when cache capacity is exceeded", () => {
    // base is 2 so the capacity can be easily exceeded
    const { result } = doRenderHook({});

    act(() => {
      result.current.put({ url: "url1", response: { data: 1 }, ok: true });
      result.current.put({ url: "url2", response: { data: 2 }, ok: true });
    });

    let fromCache: any = null;

    act(() => {
      fromCache = result.current.retrieve("url1");
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 1 });

    act(() => {
      fromCache = result.current.retrieve("url2");
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 2 });

    /* putting third item in which will exceed capacity */
    act(() => {
      result.current.put({ url: "url3", response: { data: 3 }, ok: true });
    });

    /* reretrieving url1; should be null */
    act(() => {
      fromCache = result.current.retrieve("url1");
    });

    expect(fromCache).toBe(null);

    act(() => {
      fromCache = result.current.retrieve("url2");
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 2 });

    act(() => {
      fromCache = result.current.retrieve("url3");
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 3 });
  });

  it("updates lastAccessed on retrieval", () => {
    const { result } = doRenderHook({});

    act(() => {
      result.current.put({ url: "url1", response: { data: 1 }, ok: true });
      result.current.put({ url: "url2", response: { data: 2 }, ok: true });
      /* url1 is being retrieved so url2 is lru instead */
      result.current.retrieve("url1");
      result.current.put({ url: "url3", response: { data: 3 }, ok: true });
    });

    let fromCache: any = null;

    act(() => {
      fromCache = result.current.retrieve("url1");
    });

    expect(fromCache).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 1 });

    act(() => {
      fromCache = result.current.retrieve("url2");
    });

    expect(fromCache).toBe(null);

    act(() => {
      fromCache = result.current.retrieve("url3");
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 3 });
  });

  it("does not increment items stored on item update", () => {
    const { result } = doRenderHook({});

    act(() => {
      result.current.put({ url: "url1", response: { data: 1 }, ok: true });
      result.current.put({ url: "url2", response: { data: 2 }, ok: true });

      /* doing this should not lead to any evictions */
      for (let i = 0; i < 5; i++) {
        result.current.put({
          url: "url1",
          response: { data: "new" },
          ok: true,
        });
      }
    });

    let fromCache: any = null;

    act(() => {
      fromCache = result.current.retrieve("url1");
    });

    expect(fromCache).not.toBe(null);
    /* most recent data put for the url. */
    expect(fromCache.response).toEqual({ data: "new" });

    act(() => {
      fromCache = result.current.retrieve("url2");
    });

    expect(fromCache).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 2 });
  });

  it("can clear the cache", () => {
    const { result } = doRenderHook({});

    act(() => {
      result.current.put({ url: "url1", response: { data: 1 }, ok: true });
    });

    let fromCache: any = null;

    act(() => {
      fromCache = result.current.retrieve("url1");
    });

    expect(fromCache).not.toBe(null);
    expect(fromCache.response).toEqual({ data: 1 });

    act(() => {
      result.current.clear();
      fromCache = result.current.retrieve("url1");
    });

    expect(fromCache).toBe(null);
  });

  it("clears all but kept items with keepOnlyUrlsWithOneOfSubstrings", () => {
    const { result } = doRenderHook({ capacity: 100 });

    const testUrls = [
      "api/users/123",
      "api/posts/456",
      "api/comments/789",
      "api/users/987",
      "api/settings/654",
    ];

    act(() => {
      testUrls.forEach((url) => {
        result.current.put({
          url,
          response: { data: "test" },
          ok: true,
        });
      });
    });

    const keepSubstrings = ["users", "posts"];

    act(() => {
      result.current.keepOnlyUrlsWithOneOfSubstrings(keepSubstrings);
    });

    testUrls.forEach((url) => {
      const shouldBeKept = keepSubstrings.some((substr) =>
        url.includes(substr)
      );

      const cached = result.current.retrieve(url);

      if (shouldBeKept) {
        expect(cached).not.toBeNull();
        expect(cached?.response).toEqual({ data: "test" });
      } else {
        expect(cached).toBeNull();
      }
    });
  });
});
