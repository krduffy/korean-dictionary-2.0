import { APIResponseType } from "./apiCallTypes";
import {
  CacheFacingAPIDataChangeListenerData,
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
  put: ({
    // eslint-disable-next-line no-unused-vars
    url,
    // eslint-disable-next-line no-unused-vars
    response,
    // eslint-disable-next-line no-unused-vars
    ok,
    // eslint-disable-next-line no-unused-vars
    body,
  }: {
    url: string;
    response: APIResponseType;
    ok: boolean;
    body?: BodyInit | undefined;
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
  }: {
    url: string;
    body?: BodyInit | undefined;
    cacheUpdaters: {
      pk: number | string;
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
  }) => void;
};

export type UseCacheArgs = {
  capacity: number;
};
