import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { ComponentType } from "react";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "../ErrorMessageTemplates";
import { LoadingIndicator } from "../../../ui/LoadingIndicator";
import { ErrorMessage } from "../../../text-formatters/messages/ErrorMessage";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { UserExamplesListAndForms } from "./UserExamplesListAndForms";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";

const DefaultLoadingComponent = () => <LoadingIndicator maxDim={32} />;

export const UserExamplesFormatter = <
  DataType extends
    | UserVideoExampleType
    | UserExampleSentenceType
    | UserImageExampleType,
>({
  requestState,
  LoadingComponent = DefaultLoadingComponent,
}: {
  requestState: RequestStateType;
  LoadingComponent?: ComponentType;
}) => {
  const { progress, response } = requestState;

  const { verifier } = useUserExamplesContext();

  if (progress === "idle") return <></>;

  if (progress === "loading") return <LoadingComponent />;

  if (progress === "error") return <ErrorMessage error={response} />;

  if (!response) {
    return <NoResponseError />;
  }

  if (!Array.isArray(response)) {
    return <NotAnArrayError />;
  }

  if (!response.every((data) => verifier(data))) {
    return <WrongFormatError />;
  }

  return <UserExamplesListAndForms<DataType> initialData={response} />;
};
