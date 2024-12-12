import { useRef } from "react";
import {
  CacheItem,
  CacheType,
  UseCacheArgs,
  UseCacheReturns,
} from "../../types/cacheTypes";
import { APIResponseType } from "../../types/apiCallTypes";
import { CacheFacingAPIDataChangeListenerData } from "../../types/apiDataChangeEventTypes";
import { ValidPkFieldType } from "../../types/views/dictionary-items/sharedTypes";
import { useGlobalFunctionsContext } from "../../contexts/GlobalFunctionsContextProvider";

export const useCache = ({ capacity }: UseCacheArgs): UseCacheReturns => {
  const { globalSubscribe, globalUnsubscribe } = useGlobalFunctionsContext();

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

  const setItemListenerArgs = <PkFieldType extends ValidPkFieldType>({
    url,
    body,
    cacheUpdaters,
  }: {
    url: string;
    body?: BodyInit | undefined;
    cacheUpdaters: {
      pk: PkFieldType;
      eventType: CacheFacingAPIDataChangeListenerData["eventType"];
      responseUpdater: (
        // eslint-disable-next-line no-unused-vars
        prevResponse: APIResponseType,
        // eslint-disable-next-line no-unused-vars
        newValue: Parameters<
          CacheFacingAPIDataChangeListenerData["onNotification"]
        >[0]
      ) => APIResponseType;
    }[];
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

  return {
    clear,
    put,
    retrieve,
    setItemListenerArgs,
  };
};
