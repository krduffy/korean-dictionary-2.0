import { APIResponseType } from "./apiCallTypes";

export type CacheItem = {
  lastAccessed: number;
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
  updateItemResponse: ({
    // eslint-disable-next-line no-unused-vars
    url,
    // eslint-disable-next-line no-unused-vars
    body,
    // eslint-disable-next-line no-unused-vars
    updater,
  }: {
    url: string;
    body?: BodyInit | undefined;
    // eslint-disable-next-line no-unused-vars
    updater: (prevResponse: APIResponseType) => APIResponseType;
  }) => void;
};

export type UseCacheArgs = {
  capacity: number;
};
