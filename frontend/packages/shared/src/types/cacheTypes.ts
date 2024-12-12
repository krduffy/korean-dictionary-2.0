import { APIResponseType } from "./apiCallTypes";
import {
  APIDataChangeListenerData,
  SavedSubscriptionArguments,
  SubscribeFnType,
  UnsubscribeFnType,
} from "./apiDataChangeEventTypes";

export type CacheItem = {
  lastAccessed: number;
  ok: boolean;
  response: APIResponseType;
  apiDataChangeSubscriptionArgs: SavedSubscriptionArguments[];
};

export type CacheType = {
  capacity: number;
  stored: number;
  items: Map<string, CacheItem>;
};

export type UseCacheReturns = {
  clear: () => void;
  put: ({
    // eslint-disable-next-line no-unused-vars
    url,
    // eslint-disable-next-line no-unused-vars
    response,
    // eslint-disable-next-line no-unused-vars
    ok,
    // eslint-disable-next-line no-unused-vars
    body,
    // eslint-disable-next-line no-unused-vars
    unsubscribe,
  }: {
    url: string;
    response: APIResponseType;
    ok: boolean;
    body?: BodyInit | undefined;
    unsubscribe: UnsubscribeFnType;
  }) => void;
  // eslint-disable-next-line no-unused-vars
  retrieve: (url: string, body?: BodyInit | undefined) => CacheItem | null;
  setItemListenerArgs: ({
    // eslint-disable-next-line no-unused-vars
    url,
    // eslint-disable-next-line no-unused-vars
    body,
    // eslint-disable-next-line no-unused-vars
    cacheUpdaters,
    // eslint-disable-next-line no-unused-vars
    subscribe,
  }: {
    url: string;
    body?: BodyInit | undefined;
    cacheUpdaters: {
      pk: number | string;
      eventType: APIDataChangeListenerData["eventType"];
      responseUpdater: (
        // eslint-disable-next-line no-unused-vars
        prevResponse: APIResponseType,
        // eslint-disable-next-line no-unused-vars
        newValue: Parameters<APIDataChangeListenerData["onNotification"]>[0]
      ) => APIResponseType;
    }[];
    subscribe: SubscribeFnType;
  }) => void;
};

export type UseCacheArgs = {
  capacity: number;
};
