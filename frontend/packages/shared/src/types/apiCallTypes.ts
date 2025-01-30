import { UseCacheReturns } from "./cacheTypes";
import { isArrayOf, isNumber, isObject, isString } from "./guardUtils";

export type JsonPrimitiveType = number | string | boolean | null;
export type JsonDataType = JsonPrimitiveType | JsonArrayType | JsonObjectType;
export type JsonArrayType = JsonDataType[];
export type JsonObjectType = { [key: string]: JsonDataType };

export type APIResponseType = JsonObjectType | null;

export type PaginatedResultsResponse<T> = {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
};

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

export type RequestStateType = {
  progress: "loading" | "success" | "error" | "idle";
  response: APIResponseType | null;
};

/* Returned from useCallAPI. */
export interface UseCallAPIReturns {
  requestState: RequestStateType;
  // eslint-disable-next-line no-unused-vars
  callAPI: (url: string, config?: RequestConfig) => Promise<APIResponseType>;
}

/* ======================= Guards ======================= */

export function isGeneralPaginatedResultsResponse(
  response: unknown
): response is PaginatedResultsResponse<any> {
  return isPaginatedResultsResponse<any>(
    response,
    (data: unknown): data is any => true
  );
}

export function isPaginatedResultsResponse<T>(
  response: unknown,
  typeVerifier: (data: unknown) => data is T
): response is PaginatedResultsResponse<T> {
  return (
    isObject(response) &&
    isNumber(response.count) &&
    (response.next === null || isString(response.next)) &&
    (response.previous === null || isString(response.previous)) &&
    isArrayOf(response.results, typeVerifier)
  );
}
