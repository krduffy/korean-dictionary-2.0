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
    url: string,
    response: APIResponseType,
    ok: boolean,
    body?: BodyInit | undefined
  ) => void;
  retrieve: (url: string, body?: BodyInit | undefined) => CacheItem | null;
};

export type UseCacheArgs = {
  capacity: number;
};
