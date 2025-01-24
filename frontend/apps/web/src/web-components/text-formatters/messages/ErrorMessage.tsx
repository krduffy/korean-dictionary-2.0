import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { prettifyJson } from "../../../web-utils/prettifyJson";
import { CircleX } from "lucide-react";

export const ErrorMessage = ({
  error,
}: {
  error: APIResponseType | string;
}) => {
  return (
    <div className="w-full flex justify-center" aria-label="error-wrapper">
      <section
        style={{ border: "1px var(--error-border) solid" }}
        className="bg-[color:--error-background] rounded-lg p-2 px-4"
      >
        <header className="[color:--error-text] flex flex-row items-center justify-center gap-4">
          <CircleX />
          <h2 className="text-center">오류가 발생했습니다.</h2>
        </header>
        <div className="text-center">
          <FormattedError error={error} />
        </div>
      </section>
    </div>
  );
};

export const FormattedError = ({
  error,
}: {
  error: APIResponseType | string;
}) => {
  return typeof error === "object" ? (
    <APIResponseErrorMessage errorResponse={error} />
  ) : (
    <p>{error}</p>
  );
};

export const APIResponseErrorMessage = ({
  errorResponse,
}: {
  errorResponse: APIResponseType;
}) => {
  if (errorResponse?.detail) {
    return <span>{String(errorResponse.detail)}</span>;
  }

  return (
    <div className="w-full">
      <div className="px-[10%] items-center flex flex-1">
        <code className="">{prettifyJson(errorResponse, 0)}</code>
      </div>
    </div>
  );
};
