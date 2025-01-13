import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { ComponentType } from "react";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { ErrorMessage } from "../text-formatters/messages/ErrorMessage";

export const FormResultInfoArea = ({
  requestState,
  LoadingComponent = LoadingIndicator,
  SuccessComponent,
}: {
  requestState: RequestStateType;
  LoadingComponent?: ComponentType;
  SuccessComponent: ComponentType;
}) => {
  const { progress, response } = requestState;

  if (progress === "idle") return <></>;

  if (progress === "loading") return <LoadingComponent />;

  if (progress === "error") return <ErrorMessage error={response} />;

  return <SuccessComponent />;
};
