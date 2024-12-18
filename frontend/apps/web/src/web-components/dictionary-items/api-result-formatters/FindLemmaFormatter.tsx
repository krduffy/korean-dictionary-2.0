import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { NoResponseError, WrongFormatError } from "./ErrorMessageTemplates";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { ErrorMessage } from "../../text-formatters/ErrorMessage";

export const FindLemmaFormatter = ({
  requestState,
}: {
  requestState: RequestStateType;
}) => {
  const { progress, response } = requestState;

  if (progress === "idle") {
    return;
  }

  if (progress === "loading") {
    return <LoadingIndicator />;
  }

  if (progress === "error") {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!response) {
    return <NoResponseError />;
  }

  if (!response.found) {
    return <WrongFormatError />;
  }
};
