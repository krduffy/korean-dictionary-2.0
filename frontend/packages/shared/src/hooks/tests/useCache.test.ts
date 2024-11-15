/**
 * @jest-environment jsdom
 */
// @ts-nocheck

import { act, renderHook } from "@testing-library/react";
import { useCache } from "../useCache";
import { CacheItem } from "src/types/cacheTypes";

describe("useCache", () => {
  const smallCapacity = 2;

  it("correctly puts and fetches a url", () => {
    const { result } = renderHook(() => useCache({ capacity: smallCapacity }));

    const url = "url";
    const response = { data: 1 };

    act(() => {
      result.current.put(url, response, true);
    });

    let fromCache = null;

    act(() => {
      fromCache = result.current.retrieve(url);
    });

    expect(fromCache.response).not.toBe(null);
    expect(fromCache.response).toEqual(response);
  });

  it("correctly differentiates between different bodies and identical urls", () => {
    const { result } = renderHook(() => useCache({ capacity: smallCapacity }));

    const url = "url";

    const body1 = JSON.stringify({ s: "s1" });
    const body2 = JSON.stringify({ s: "s2" });

    const response1 = { data: 1 };
    const response2 = { data: 2 };

    act(() => {
      result.current.put(url, response1, true, body1);
      result.current.put(url, response2, true, body2);
    });

    let fromCache = null;

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
    const capacity = 2;

    const { result } = renderHook(() => useCache({ capacity: capacity }));

    act(() => {
      result.current.put("url1", { data: 1 }, true);
      result.current.put("url2", { data: 2 }, true);
    });

    let fromCache: CacheItem | null = null;

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
      result.current.put("url3", { data: 3 }, true);
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
    const capacity = 2;

    const { result } = renderHook(() => useCache({ capacity: capacity }));

    act(() => {
      result.current.put("url1", { data: 1 }, true);
      result.current.put("url2", { data: 2 }, true);
      /* url1 is being retrieved so url2 is lru instead */
      result.current.retrieve("url1");
      result.current.put("url3", { data: 3 }, true);
    });

    let fromCache: CacheItem | null = null;

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
    const capacity = 2;

    const { result } = renderHook(() => useCache({ capacity: capacity }));

    act(() => {
      result.current.put("url1", { data: 1 }, true);
      result.current.put("url2", { data: 2 }, true);

      /* doing this should not lead to any evictions */
      for (let i = 0; i < 5; i++) {
        result.current.put("url1", { data: "new" }, true);
      }
    });

    let fromCache: CacheItem | null = null;

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
    const { result } = renderHook(() => useCache({ capacity: smallCapacity }));

    act(() => {
      result.current.put("url1", { data: 1 }, true);
    });

    let fromCache: CacheItem | null = null;

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
});
