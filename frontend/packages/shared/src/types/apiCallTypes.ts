/* Tokens returned from server. */
export interface AuthTokens {
  access: string;
  /* refresh optional since stored in cookie on web. */
  refresh?: string;
}

/* Token related functions that need to be provided to useCallAPI so it can handle auth */
export interface TokenHandlers {
  getAccessToken: () => Promise<string | null>;
  refreshTokens: () => Promise<AuthTokens>;
  // eslint-disable-next-line no-unused-vars
  deleteTokens: () => Promise<void>;
  saveTokens: (tokens: AuthTokens) => Promise<void>;
}

/* Needs to be passed into useCallAPI. */
export interface UseCallAPIArgs {
  tokenHandlers: TokenHandlers;
  onRefreshFail: () => void;
  includeCredentials: boolean;
}

/* What can be passed into callAPI() as returned from useCallAPI */
export interface RequestConfig {
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit;
  credentials?: "include";
}

/* Returned from useCallAPI. */
export interface UseCallAPIReturns<T = any> {
  successful: boolean;
  error: boolean;
  loading: boolean;
  response: T | null;
  // eslint-disable-next-line no-unused-vars
  callAPI: (url: string, config?: RequestConfig) => Promise<T>;
}

/* Used for abstracted versions of the useCallAPI that need separate access to token handlers like 
useLoginForm */
export interface UseCallAPIHookWithTokenHandlerArgs {
  useCallAPIReturns: UseCallAPIReturns;
  tokenHandlers: TokenHandlers;
}

/* FORM */
/* FormData */
export interface FormDataState {
  [key: string]: any;
}

/* useForm needs initial data and an  */
export interface UseFormArgs {
  url: string;
  initialFormData: FormDataState;
  useCallAPIInstance: UseCallAPIReturns;
  includeCredentials: boolean;
}
