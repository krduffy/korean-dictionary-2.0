import { APIResponseType } from "../../../types/apiCallTypes";

export type MockedFetchType = (
  // eslint-disable-next-line no-unused-vars
  url: string,
  // eslint-disable-next-line no-unused-vars
  request?: Request
) => {
  ok: boolean;
  status: number;
  json: () => APIResponseType;
};

export class FetchMockFactory {
  // eslint-disable-next-line no-unused-vars
  getOk: (request?: Request) => boolean;
  // eslint-disable-next-line no-unused-vars
  getStatus: (request?: Request) => number;
  // eslint-disable-next-line no-unused-vars
  getJson: (request?: Request) => () => APIResponseType;

  unconditionalSuccessResponse: APIResponseType;
  unconditionalFailResponse: APIResponseType;
  unauthenticatedSuccessResponse: APIResponseType;
  authenticatedSuccessResponse: APIResponseType;
  unauthenticatedFailResponse: APIResponseType;
  authenticatedFailResponse: APIResponseType;

  authenticatedToken: string;

  errorMessage: string;

  getMock(): MockedFetchType {
    return (url: string, request?: Request) => ({
      ok: this.getOk(request),
      status: this.getStatus(request),
      json: this.getJson(request),
    });
  }

  /** Initializes the builder to an unconditionally successful fetch. */
  constructor() {
    this.getOk = () => true;
    this.getStatus = () => 200;
    this.getJson = () => () => this.unconditionalSuccessResponse;

    this.unconditionalSuccessResponse = { message: "Success" } as const;
    this.unconditionalFailResponse = { message: "Fail" } as const;

    this.unauthenticatedSuccessResponse = {
      message: "Unauthed / Success",
    } as const;
    this.authenticatedSuccessResponse = {
      message: "Authed / Success",
    } as const;
    this.unauthenticatedFailResponse = {
      message: "Unauthed / Fail",
    } as const;
    this.authenticatedFailResponse = { message: "Authed / Fail" } as const;

    this.authenticatedToken = "AUTHTOKEN";

    this.errorMessage = "ERROR";
  }

  // eslint-disable-next-line no-unused-vars
  setGetOk(newValue: boolean | ((request?: Request | undefined) => boolean)) {
    if (typeof newValue === "boolean") {
      this.getOk = () => newValue;
    } else {
      this.getOk = newValue;
    }

    return this;
  }

  // eslint-disable-next-line no-unused-vars
  setGetStatus(newValue: number | ((request?: Request | undefined) => number)) {
    if (typeof newValue === "number") {
      this.getStatus = () => newValue;
    } else {
      this.getStatus = newValue;
    }
    return this;
  }

  setGetJson(
    newValue:
      | APIResponseType
      // eslint-disable-next-line no-unused-vars
      | ((request?: Request | undefined) => () => APIResponseType)
  ) {
    if (typeof newValue === "object") {
      this.getJson = () => () => newValue;
    } else {
      this.getJson = newValue;
    }
    return this;
  }

  setUnconditionallyUnsuccessful() {
    this.getOk = () => false;
    this.getStatus = () => 400;
    this.getJson = () => () => this.unconditionalFailResponse;
    return this;
  }

  _isAuth(request: Request | undefined) {
    return (
      request?.headers?.get("Authorization") ===
      `Bearer ${this.authenticatedToken}`
    );
  }

  _setAuthChecked({
    okIfAuth = true,
    okIfUnauth = false,
    statusIfAuth = 200,
    statusIfUnauth = 401,
    responseIfAuth = this.authenticatedSuccessResponse,
    responseIfUnauth = this.unauthenticatedFailResponse,
  }: {
    okIfAuth?: boolean;
    okIfUnauth?: boolean;
    statusIfAuth?: number;
    statusIfUnauth?: number;
    responseIfAuth?: APIResponseType;
    responseIfUnauth?: APIResponseType;
  }) {
    this.getOk = (request) => (this._isAuth(request) ? okIfAuth : okIfUnauth);
    this.getStatus = (request) =>
      this._isAuth(request) ? statusIfAuth : statusIfUnauth;
    this.getJson = (request) =>
      this._isAuth(request) ? () => responseIfAuth : () => responseIfUnauth;
  }

  setAuthProtected() {
    this._setAuthChecked({});
    return this;
  }

  setAuthOnlyChecked() {
    this._setAuthChecked({
      okIfUnauth: true,
      statusIfUnauth: 200,
      responseIfUnauth: this.unauthenticatedSuccessResponse,
    });
    return this;
  }

  setToError() {
    this.getStatus = () => {
      throw new Error(this.errorMessage);
    };
    return this;
  }
}
