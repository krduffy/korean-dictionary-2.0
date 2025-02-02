import { useRef } from "react";
import {
  APIDataChangeCacheUpdater,
  CacheItem,
  CacheType,
  UseCacheArgs,
  UseCacheReturns,
} from "../../types/cacheTypes";
import { APIResponseType } from "../../types/apiCallTypes";
import { APIDataChangeEventType } from "../../types/apiDataChangeEventTypes";

export const useCache = ({
  capacity,
  globalSubscribe,
  globalUnsubscribe,
}: UseCacheArgs): UseCacheReturns => {
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

  const put = ({
    url,
    response,
    ok,
    body,
  }: {
    url: string;
    response: APIResponseType;
    ok: boolean;
    body?: BodyInit | undefined;
  }) => {
    const key: string = getKey(url, body);

    /* only if being added for first time stored is incremented */
    if (!cache.current.items.has(key)) {
      cache.current.stored += 1;
    } else {
      clearListenerArgsByKey(key);
    }

    /* add or update */
    cache.current.items.set(key, {
      lastAccessed: counter.current++,
      response: response,
      ok: ok,
      apiDataChangeSubscriptionArgs: [],
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
        clearListenerArgsByKey(keyToEvict);
        cache.current.items.delete(keyToEvict);
        cache.current.stored -= 1;
      }
    }
  };

  const setItemListenerArgs = ({
    url,
    body,
    cacheUpdaters,
  }: {
    url: string;
    body?: BodyInit | undefined;
    cacheUpdaters: APIDataChangeCacheUpdater<APIDataChangeEventType>[];
  }) => {
    const key = getKey(url, body);
    const item = cache.current.items.get(key);

    if (item) {
      const apiDataChangeSubscriptionArgs = cacheUpdaters.map((updaterArgs) => {
        const onNotification = (
          newValue: Parameters<typeof updaterArgs.responseUpdater>[1]
        ) => {
          item.response = updaterArgs.responseUpdater(item.response, newValue);
        };

        return {
          pk: updaterArgs.pk,
          listenerData: {
            eventType: updaterArgs.eventType,
            onNotification: onNotification,
          },
        };
      });

      item.apiDataChangeSubscriptionArgs = apiDataChangeSubscriptionArgs;

      item.apiDataChangeSubscriptionArgs.forEach((subscriptionArgs) => {
        globalSubscribe(subscriptionArgs.pk, subscriptionArgs.listenerData);
      });
    }
  };

  const clearListenerArgsByKey = (key: string) => {
    const item = cache.current.items.get(key);

    if (item) {
      item.apiDataChangeSubscriptionArgs.forEach((subscriptionArgs) => {
        globalUnsubscribe(subscriptionArgs.pk, subscriptionArgs.listenerData);
      });
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

  const keepOnlyUrlsWithOneOfSubstrings = (substrings: string[]) => {
    /* key is constructed with the url,
     * so if none of the substrs of key are an exception, delete.
     */

    const newCache: CacheType = {
      capacity: capacity,
      stored: 0,
      items: new Map(),
    };

    for (const [key, value] of cache.current.items) {
      let isKept = false;

      for (const keptSubstring of substrings) {
        if (key.includes(keptSubstring)) {
          isKept = true;
          break;
        }
      }

      if (isKept) {
        newCache.items.set(key, value);
        newCache.stored++;
      }
    }

    cache.current = newCache;
  };

  return {
    clear,
    put,
    retrieve,
    setItemListenerArgs,
    keepOnlyUrlsWithOneOfSubstrings,
  };
};
