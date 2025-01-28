import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { NoResponseError, WrongFormatError } from "./ErrorMessageTemplates";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { ErrorMessage } from "../../text-formatters/messages/ErrorMessage";

export const ReplacedViewFormatter = ({
  requestState,
}: {
  requestState: RequestStateType;
}) => {
  const { progress, response } = requestState;

  if (progress === "idle") {
    return;
  }

  if (progress === "loading") {
    return <LoadingIndicator maxDim={32} />;
  }

  if (progress === "error") {
    return <ErrorMessage error={response} />;
  }

  if (!response) {
    return <NoResponseError />;
  }

  if (!response.found) {
    return <WrongFormatError />;
  }
};
