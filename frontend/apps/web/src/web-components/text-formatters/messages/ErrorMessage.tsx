import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { prettifyJson } from "../../../web-utils/prettifyJson";
import { CircleX } from "lucide-react";

export const ErrorMessage = ({
  error,
}: {
  error: APIResponseType | string;
}) => {
  return (
    <section>
      <header className="[color:--error-color] flex flex-row items-center justify-center gap-4">
        <CircleX />
        <h2 className="text-center">오류가 발생했습니다.</h2>
      </header>
      <div className="">
        <FormattedError error={error} />
      </div>
    </section>
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
  return (
    <div className="w-full">
      <div className="px-[10%] items-center flex flex-1">
        <code className="">{prettifyJson(errorResponse, 0)}</code>
      </div>
    </div>
  );
};
