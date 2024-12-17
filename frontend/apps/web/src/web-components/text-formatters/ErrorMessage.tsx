import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { prettifyJson } from "../../web-utils/prettifyJson";

export const ErrorMessage = ({
  errorResponse,
}: {
  errorResponse: APIResponseType;
}) => {
  return (
    <div className="w-full">
      <div className="[color:--error-color] text-center float">
        오류가 발생했습니다.
      </div>
      <div className="px-[10%] items-center float float-1">
        <code className="">{prettifyJson(errorResponse, 0)}</code>
      </div>
    </div>
  );
};
