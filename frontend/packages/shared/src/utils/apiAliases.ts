import {
  HanjaSearchConfig,
  KoreanSearchConfig,
} from "your-package/types/panelAndViewTypes";

/* Cert requires localhost, not 127.0.0.1 */
const API_URL = "https://localhost:8000/";

const endpoints = {
  login: "users/auth/login",
  refresh: "users/auth/refresh",
  register: "users/auth/register",
  change_password: "users/auth/change_password",
  homepage: "users/my_info",
  search_korean: "dictionary/korean/search",
  search_hanja: "dictionary/hanja/search",
  detail_korean: "dictionary/korean/detail",
  detail_hanja: "dictionary/hanja/detail",
} as const;

interface GetEndpointArgs {
  endpoint: keyof typeof endpoints;
  pk?: number | string;
}

export const getEndpoint = ({ endpoint, pk }: GetEndpointArgs) => {
  if (!pk) {
    return API_URL + endpoints[endpoint];
  } else {
    return API_URL + endpoints[endpoint] + `/${pk}`;
  }
};

const getArgsAsQueryParamString = (
  obj: KoreanSearchConfig | HanjaSearchConfig
) => {
  return Object.entries(obj)
    .reduce(
      (accumulator, [key, value]) =>
        accumulator +
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(String(value)) +
        "&",
      ""
    )
    .slice(0, -1);
};

export const getEndpointWithKoreanSearchConfig = (
  koreanSearchConfig: KoreanSearchConfig
) => {
  const endingArgs = getArgsAsQueryParamString(koreanSearchConfig);

  return getEndpoint({ endpoint: "search_korean" }) + "?" + endingArgs;
};

export const getEndpointWithHanjaSearchConfig = (
  hanjaSearchConfig: HanjaSearchConfig
) => {
  const endingArgs = getArgsAsQueryParamString(hanjaSearchConfig);

  return getEndpoint({ endpoint: "search_hanja" }) + "?" + endingArgs;
};
