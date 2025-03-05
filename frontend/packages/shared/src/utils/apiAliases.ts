import {
  ExamLevel,
  HanjaSearchConfig,
  SearchConfig,
} from "../types/views/searchConfigTypes";

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
  get_derived_example_lemmas_search:
    "user_examples/get/derived_example_lemmas/search",
  get_derived_example_text: "user_examples/get/derived_example_text",
  // these 2 have same one but the second one takes 2 pks
  get_derived_example_lemmas_from_text:
    "user_examples/get/derived_example_lemmas/from_text",
  get_derived_example_lemmas_from_text_at_eojeol_num:
    "user_examples/get/derived_example_lemmas/from_text",
  derived_examples_texts: "user_examples/derived_examples/texts",
} as const;

export type ApiEndpoint = keyof typeof endpoints;

export type GetDerivedExampleLemmasSearchQueryParams = {
  page: number;
  headword_pk: number;
  lemma: string;
};

export interface HanjaExamplesSearchConfig {
  page: number;
}

export interface HanjaExamplesFromTextSearchConfig {
  only_unknown: boolean;
  page: number;
}

export interface UserExamplesTextsSearchConfig {
  search: string;
  page: number;
}

type QueryParams =
  | SearchConfig
  | GetDerivedExampleLemmasSearchQueryParams
  | HanjaExamplesSearchConfig
  | HanjaExamplesFromTextSearchConfig
  | UserExamplesTextsSearchConfig;

export const getUserExampleEndpoint = ({
  exampleType,
  headwordTargetCode,
  exampleItemPk,
}: {
  exampleType: "sentence" | "video" | "image";
  headwordTargetCode: number;
  exampleItemPk?: number;
}) => {
  const base = `${API_URL}user_examples/${headwordTargetCode}/${exampleType}`;

  if (exampleItemPk === undefined) return base;

  return base + `/${exampleItemPk}`;
};

interface GetEndpointArgs {
  endpoint: ApiEndpoint;
  pk?: number | string | (number | string)[];
  queryParams?: QueryParams;
}

export const getEndpoint = ({ endpoint, pk, queryParams }: GetEndpointArgs) => {
  let baseUrl;

  let pkString = "";

  if (pk === undefined) {
    baseUrl = API_URL + endpoints[endpoint];
  } else {
    if (Array.isArray(pk)) {
      pkString = "/" + pk.join("/");
    } else {
      pkString = `/${pk}`;
    }

    baseUrl = API_URL + endpoints[endpoint] + pkString;
  }

  if (queryParams === undefined) return baseUrl;

  let stringifiedParams: string;
  if (endpoint === "search_hanja") {
    stringifiedParams = getHanjaSearchQueryParamString(
      queryParams as HanjaSearchConfig
    );
  } else {
    stringifiedParams = getArgsAsQueryParamString(queryParams);
  }
  return baseUrl + "?" + stringifiedParams;
};

const getArgsAsQueryParamString = (
  params: QueryParams | Record<string, string | number>
) => {
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

const getHanjaSearchQueryParamString = (params: HanjaSearchConfig) => {
  const updatedParams: Record<string, string | number> = {
    search_term: params.search_term,
    page: params.page,
  };

  if (params.decomposition !== undefined) {
    updatedParams.decomposition = params.decomposition;
  }

  if (params.exam_level !== undefined) {
    updatedParams.result_ranking = `${params.exam_level.operand}${getExamRankNum(
      params.exam_level.level
    )}`;
  }

  if (params.grade_level !== undefined) {
    updatedParams.grade_level = `${params.grade_level.operand}${params.grade_level.level}`;
  }

  if (params.strokes !== undefined) {
    updatedParams.strokes = `${params.strokes.operand}${params.strokes.strokes}`;
  }

  if (params.radical !== undefined) {
    updatedParams.radical = params.radical;
  }

  return getArgsAsQueryParamString(updatedParams);
};

const getExamRankNum = (examRank: ExamLevel) => {
  switch (examRank) {
    case "8급":
      return 16;
    case "준7급":
      return 15;
    case "7급":
      return 14;
    case "준6급":
      return 13;
    case "6급":
      return 12;
    case "준5급":
      return 11;
    case "5급":
      return 10;
    case "준4급":
      return 9;
    case "4급":
      return 8;
    case "준3급":
      return 7;
    case "3급":
      return 6;
    case "준2급":
      return 5;
    case "2급":
      return 4;
    case "준1급":
      return 3;
    case "1급":
      return 2;
    case "준특급":
      return 1;
    case "특급":
      return 0;
    case "미배정":
      return -1;
  }
};
