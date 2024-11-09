import { useRef } from "react";

export type APIResponseType = Record<string, any>;

export type CacheItem = {
  age: number;
  ok: boolean;
  response: APIResponseType;
};

export type CacheType = {
  capacity: number;
  stored: number;
  items: Map<string, CacheItem>;
};

export type UseCacheReturns = {
  clear: () => void;
  put: (
    url: string,
    response: APIResponseType,
    ok: boolean,
    body?: BodyInit | undefined
  ) => void;
  retrieve: (url: string, body: BodyInit | undefined) => CacheItem | null;
};

export type UseCacheArgs = {
  capacity: number;
};

export const useCache = ({ capacity }: UseCacheArgs): UseCacheReturns => {
  const initialCache = {
    capacity: capacity,
    stored: 0,
    items: new Map(),
  };

  const cache = useRef<CacheType>(initialCache);

  /* used to keep track of item ages */
  const counter = useRef<number>(0);

  const clear = () => {
    cache.current = initialCache;
  };

  const getKey = (url: string, body?: BodyInit | undefined) => {
    if (body) {
      return url + String(body);
    }

    return url;
  };

  const put = (
    url: string,
    response: APIResponseType,
    ok: boolean,
    body?: BodyInit | undefined
  ) => {
    const key: string = getKey(url, body);

    if (cache.current.items.size >= cache.current.capacity) {
      let lowest = Infinity;
      const cacheAsArray = Object.entries(cache.current.items);
      let keyToEvict = "";

      if (cacheAsArray !== undefined) {
        for (let i = 0; i < cacheAsArray.length; i++) {
          if (cacheAsArray[i]?.[1].lastAccessed < lowest) {
            lowest = cacheAsArray[i]?.[1].lastAccessed;
            keyToEvict = cacheAsArray[i]?.[0] ?? "";
          }
        }

        cache.current.items.delete(keyToEvict);
        cache.current.stored -= 1;
      }
    }

    cache.current.items.set(key, {
      age: counter.current++,
      response: response,
      ok: ok,
    });
    cache.current.stored += 1;
  };

  const retrieve = (url: string, body?: BodyInit | undefined) => {
    const key = getKey(url, body);
    const item = cache.current.items.get(key);

    if (item) {
      item.age = counter.current++;
      return item;
    } else {
      return null;
    }
  };

  return {
    clear,
    put,
    retrieve,
  };
};
