import { APIResponseType } from "./apiCallTypes";
import {
  APIDataChangeEventType,
  CallbackParamMappings,
  SavedSubscriptionArguments,
  SubscribeFnType,
  UnsubscribeFnType,
} from "./apiDataChangeEventTypes";
import { ValidPkFieldType } from "./views/dictionary-items/sharedTypes";

export type CacheItem = {
  lastAccessed: number;
  ok: boolean;
  response: APIResponseType;
  apiDataChangeSubscriptionArgs: SavedSubscriptionArguments<APIDataChangeEventType>[];
};

export type CacheType = {
  capacity: number;
  stored: number;
  items: Map<string, CacheItem>;
};

export type APIDataChangeCacheUpdater<
  EventTypeT extends APIDataChangeEventType,
> = {
  pk: ValidPkFieldType;
  eventType: EventTypeT;
  responseUpdater: (
    // eslint-disable-next-line no-unused-vars
    prevResponse: APIResponseType,
    // eslint-disable-next-line no-unused-vars
    newValue: CallbackParamMappings[EventTypeT]
  ) => APIResponseType;
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
    cacheUpdaters: APIDataChangeCacheUpdater<APIDataChangeEventType>[];
  }) => void;
  // eslint-disable-next-line no-unused-vars
  keepOnlyUrlsWithOneOfSubstrings: (substrings: string[]) => void;
};

export type UseCacheArgs = {
  capacity: number;
  globalSubscribe: SubscribeFnType;
  globalUnsubscribe: UnsubscribeFnType;
};
