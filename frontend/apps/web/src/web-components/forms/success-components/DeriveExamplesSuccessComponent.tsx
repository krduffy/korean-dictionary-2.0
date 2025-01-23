import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { prettifyJson } from "../../../web-utils/prettifyJson";

export const DeriveExamplesSuccessComponent = ({
  serverResponse,
}: {
  serverResponse: APIResponseType;
}) => {
  return <div>{prettifyJson(serverResponse, 0)}</div>;
};
