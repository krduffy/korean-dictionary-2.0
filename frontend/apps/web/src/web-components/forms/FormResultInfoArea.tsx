import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { ComponentType } from "react";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { ErrorMessage } from "../text-formatters/messages/ErrorMessage";

const SizedLoadingIndicator = () => {
  return (
    <div>
      <LoadingIndicator maxDim={48} />
    </div>
  );
};

export const FormResultInfoArea = <SuccessComponentPropsType extends {}>({
  requestState,
  LoadingComponent = SizedLoadingIndicator,
  SuccessComponent,
  successComponentProps,
}: {
  requestState: RequestStateType;
  LoadingComponent?: ComponentType;
  SuccessComponent: ComponentType<SuccessComponentPropsType>;
  successComponentProps: SuccessComponentPropsType;
}) => {
  const { progress, response } = requestState;

  if (progress === "idle") return <></>;

  if (progress === "loading") return <LoadingComponent />;

  if (progress === "error") return <ErrorMessage error={response} />;

  return <SuccessComponent {...successComponentProps} />;
};
