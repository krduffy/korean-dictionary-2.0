import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { ComponentType } from "react";
import { NoResponseError, WrongFormatError } from "./ErrorMessageTemplates";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { ErrorMessage } from "../../text-formatters/ErrorMessage";

export const BasicAPIDataFormatter = <DataType, InteractionDataType>({
  requestState,
  verifier,
  DisplayComponent,
  LoadingComponent = LoadingIndicator,
  interactionData,
}: {
  requestState: RequestStateType;
  verifier: (data: unknown) => data is DataType;
  DisplayComponent: ComponentType<{
    data: DataType;
    interactionData: InteractionDataType;
  }>;
  LoadingComponent?: ComponentType;
  interactionData: InteractionDataType;
}) => {
  const { progress, response } = requestState;

  if (progress === "idle") return <></>;

  if (progress === "loading") return <LoadingComponent />;

  if (progress === "error") return <ErrorMessage errorResponse={response} />;

  if (!response) {
    return <NoResponseError />;
  }

  if (!verifier(response)) {
    return <WrongFormatError />;
  }

  return <DisplayComponent data={response} interactionData={interactionData} />;
};