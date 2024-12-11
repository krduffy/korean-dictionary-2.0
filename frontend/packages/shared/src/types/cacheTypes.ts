import { APIResponseType } from "./apiCallTypes";
import {
  APIDataChangeListenerData,
  SavedSubscriptionArguments,
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
  put: (
    // eslint-disable-next-line no-unused-vars
    url: string,
    // eslint-disable-next-line no-unused-vars
    response: APIResponseType,
    // eslint-disable-next-line no-unused-vars
    ok: boolean,
    // eslint-disable-next-line no-unused-vars
    body?: BodyInit | undefined
  ) => void;
  // eslint-disable-next-line no-unused-vars
  retrieve: (url: string, body?: BodyInit | undefined) => CacheItem | null;
  setItemListenerArgs: ({
    url,
    body,
    cacheUpdaters,
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
  }) => void;
};

export type UseCacheArgs = {
  capacity: number;
};
