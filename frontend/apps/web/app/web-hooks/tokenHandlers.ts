import { AuthTokens } from "@repo/shared/types/apiCallTypes";
import { getEndpoint } from "@repo/shared/utils/apiAliases";

export const getAccessToken = async () => {
  const token = sessionStorage.getItem("access");
  return token || null;
};

export const refreshTokens = async () => {
  const url = getEndpoint({ endpoint: "refresh" });

  /* No headers to set because the token is in a cookie */
  const response = await fetch(url, {
    credentials: "include",
  });

  if (response.ok) {
    return await response.json();
  }

  /* refresh failed */
  return null;
};

export const saveTokens = async (tokens: AuthTokens) => {
  console.log(tokens);
  console.log("attempting to set access tokens");
  sessionStorage.setItem("access", tokens.access);
};

export const deleteTokens = async () => {
  sessionStorage.removeItem("access");
};

export const allTokenHandlers = {
  getAccessToken,
  refreshTokens,
  deleteTokens,
  saveTokens,
};
