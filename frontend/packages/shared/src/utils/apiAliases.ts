/* Cert requires localhost, not 127.0.0.1 */
const API_URL = "https://localhost:8000/";

const endpoints = {
  login: "users/auth/login",
  refresh: "users/auth/refresh",
  register: "users/auth/register",
  change_password: "users/auth/change_password",
  homepage: "users/my_info",
  search_korean: "dictionary/korean/search?search_term=가다",
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
