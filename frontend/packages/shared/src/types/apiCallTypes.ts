import { UseCacheReturns } from "./cacheTypes";

export type JsonPrimitiveType = number | string | boolean | null;
export type JsonDataType = JsonPrimitiveType | JsonArrayType | JsonObjectType;
export type JsonArrayType = JsonDataType[];
export type JsonObjectType = { [key: string]: JsonDataType };

export type APIResponseType = JsonObjectType | null;

/** Tokens returned from server. */
export interface AuthTokens {
  access: string;
  /* refresh optional since stored in cookie on web. */
  refresh?: string;
}

/** Token related functions that need to be provided to useCallAPI so it can handle auth */
export interface TokenHandlers {
  getAccessToken: () => Promise<string | null>;
  refreshTokens: () => Promise<AuthTokens | null>;
  onRefreshFail: () => Promise<void>;
  deleteTokens: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  saveTokens: (tokens: AuthTokens) => Promise<void>;
}

/* Needs to be passed into useCallAPI. */
export interface UseCallAPIArgs {
  tokenHandlers: TokenHandlers;
  cacheResults: boolean;
  cacheFunctions: UseCacheReturns;
  // eslint-disable-next-line no-unused-vars
  onCaughtError: (err: any) => void;
}

/* What can be passed into callAPI() as returned from useCallAPI */
export interface RequestConfig {
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit;
  credentials?: "include";
}

/* Returned from useCallAPI. */
export interface UseCallAPIReturns {
  successful: boolean;
  error: boolean;
  loading: boolean;
  response: APIResponseType | null;
  // eslint-disable-next-line no-unused-vars
  callAPI: (url: string, config?: RequestConfig) => Promise<APIResponseType>;
}
