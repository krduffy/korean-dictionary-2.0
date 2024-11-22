import { AuthTokens } from "@repo/shared/types/apiCallTypes";
import { getEndpoint } from "@repo/shared/utils/apiAliases";

/* these funcs are not part of hook despite being in the hooks file because they
   should be accessing the same instance of the var below */

let alreadyShowedSessionInvalidMessage = false;

const getAccessToken = async () => {
  const token = sessionStorage.getItem("access");

  return token || null;
};

const refreshTokens = async () => {
  const url = getEndpoint({ endpoint: "refresh" });

  /* No headers to set because the token is in a cookie */
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const authTokens = await response.json();

    return authTokens;
  }

  /* refresh failed */
  return null;
};

const saveTokens = async (tokens: AuthTokens) => {
  alreadyShowedSessionInvalidMessage = false;

  sessionStorage.setItem("access", tokens.access);
};

const deleteTokens = async () => {
  sessionStorage.removeItem("access");
};

const onRefreshFail = async () => {
  if (!alreadyShowedSessionInvalidMessage) {
    alreadyShowedSessionInvalidMessage = true;
    alert("session is invalid");
  }
};

export const tokenHandlers = {
  getAccessToken,
  refreshTokens,
  deleteTokens,
  saveTokens,
  onRefreshFail,
};
