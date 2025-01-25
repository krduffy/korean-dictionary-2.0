import { SearchConfig } from "../types/views/searchConfigTypes";

/* Cert requires localhost, not 127.0.0.1 */
const API_URL = "https://localhost:8000/";

const endpoints = {
  login: "users/auth/login",
  logout: "users/auth/logout",
  refresh: "users/auth/refresh",
  register: "users/auth/register",
  change_password: "users/auth/change_password",
  user_info: "users/my_info",
  update_known_studied: "users/update/known_studied",
  search_korean: "dictionary/korean/search",
  search_hanja: "dictionary/hanja/search",
  detail_korean: "dictionary/korean/detail",
  detail_hanja: "dictionary/hanja/detail",
  popup_hanja: "dictionary/hanja/popup",
  examples_hanja: "dictionary/hanja/examples",
  find_lemma: "nlp/analyze/get_lemma",
  derive_examples_from_text: "nlp/analyze/derive_lemma_examples",
} as const;

export type ApiEndpoint = keyof typeof endpoints;

type QueryParams = SearchConfig;

interface GetEndpointArgs {
  endpoint: ApiEndpoint;
  pk?: number | string;
  queryParams?: QueryParams;
}

export const getEndpoint = ({ endpoint, pk, queryParams }: GetEndpointArgs) => {
  let baseUrl;

  if (pk === undefined) {
    baseUrl = API_URL + endpoints[endpoint];
  } else {
    baseUrl = API_URL + endpoints[endpoint] + `/${pk}`;
  }

  if (queryParams === undefined) return baseUrl;

  const stringifiedParams = getArgsAsQueryParamString(queryParams);
  return baseUrl + "?" + stringifiedParams;
};

const getArgsAsQueryParamString = (params: QueryParams) => {
  return (
    Object.entries(params)
      .reduce(
        (accumulator, [key, value]) =>
          accumulator +
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(String(value)) +
          "&",
        ""
      )
      /* the last char is deleted because it is a trailing '&' */
      .slice(0, -1)
  );
};
