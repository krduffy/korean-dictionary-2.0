import { useRef } from "react";
import {
  CacheItem,
  CacheType,
  UseCacheArgs,
  UseCacheReturns,
} from "../../types/cacheTypes";
import { APIResponseType } from "../../types/apiCallTypes";

export const useCache = ({ capacity }: UseCacheArgs): UseCacheReturns => {
  const initialCache = {
    capacity: capacity,
    stored: 0,
    items: new Map(),
  };

  const cache = useRef<CacheType>(initialCache);

  /* used to keep track of item accesses */
  const counter = useRef<number>(0);

  const clear = () => {
    cache.current.items.clear();
    cache.current.stored = 0;
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

    /* only if being added for first time stored is incremented */
    if (!cache.current.items.has(key)) {
      cache.current.stored += 1;
    }

    /* add or update */
    cache.current.items.set(key, {
      lastAccessed: counter.current++,
      response: response,
      ok: ok,
    });

    /* evict if number of stored items exceeds capacity after that addition */

    if (cache.current.stored > cache.current.capacity) {
      let lowest = Infinity;
      let keyToEvict: string | undefined = undefined;

      cache.current.items.forEach((cached, key) => {
        if (cached.lastAccessed < lowest) {
          keyToEvict = key;
          lowest = cached.lastAccessed;
        }
      });

      if (keyToEvict !== undefined) {
        cache.current.items.delete(keyToEvict);
        cache.current.stored -= 1;
      }
    }
  };

  const retrieve = (
    url: string,
    body?: BodyInit | undefined
  ): CacheItem | null => {
    const key = getKey(url, body);
    const item = cache.current.items.get(key);

    if (item) {
      item.lastAccessed = counter.current++;
      return item;
    } else {
      return null;
    }
  };

  const updateItemResponse = ({
    url,
    body,
    updater,
  }: {
    url: string;
    body?: BodyInit | undefined;
    // eslint-disable-next-line no-unused-vars
    updater: (prevResponse: APIResponseType) => APIResponseType;
  }) => {
    const key = getKey(url, body);
    const item = cache.current.items.get(key);

    if (item) {
      item.lastAccessed = counter.current++;
      item.response = updater(item.response);
    }
  };

  return {
    clear,
    put,
    retrieve,
    updateItemResponse,
  };
};
