import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { LoadingIndicator } from "../other/misc/LoadingIndicator";
import { ErrorMessage } from "../other/misc/ErrorMessage";
import {
  NoResponseError,
  WrongFormatError,
} from "../other/misc/ErrorMessageTemplates";

export const FindLemmaFormatter = ({
  requestState,
}: {
  requestState: RequestStateType;
}) => {
  const { progress, response } = requestState;

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
