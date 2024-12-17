import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { ComponentType } from "react";
import { ErrorMessage } from "../other/misc/ErrorMessage";
import {
  NoResponseError,
  WrongFormatError,
} from "../other/misc/ErrorMessageTemplates";
import { LoadingIndicator } from "../other/misc/LoadingIndicator";

export const BasicAPIDataFormatter = <DataType,>({
  requestState,
  verifier,
  DisplayComponent,
  LoadingComponent = LoadingIndicator,
}: {
  requestState: RequestStateType;
  verifier: (data: unknown) => data is DataType;
  DisplayComponent: ComponentType<{ data: DataType }>;
  LoadingComponent?: ComponentType;
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

  return <DisplayComponent data={response} />;
};
