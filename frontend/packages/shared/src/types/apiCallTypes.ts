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
  saveTokens: (tokens: AuthTokens) => Promise<void>;
}

/* Needs to be passed into useCallAPI. */
export interface UseCallAPIArgs {
  url: string;
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
  callAPI: (config?: RequestConfig) => Promise<T>;
}

/* Used for abstracted versions of the useCallAPI that have set urls like useLoginForm */
export interface UseCallAPIHookWithTokenHandlerArgs {
  useCallAPIReturns: UseCallAPIReturns;
  tokenHandlers: TokenHandlers;
}
/* v A hook that can be invoked with the given url (like useAPICallWeb) */
export type InvokablePlatformUseCallAPIHook = ({
  // eslint-disable-next-line no-unused-vars
  url,
}: {
  url: string;
}) => UseCallAPIHookWithTokenHandlerArgs;

/* FORM */
/* FormData */
export interface FormDataState {
  [key: string]: any;
}

/* useForm needs initial data and an  */
export interface UseFormArgs {
  initialFormData: FormDataState;
  useCallAPIInstance: UseCallAPIReturns;
}
