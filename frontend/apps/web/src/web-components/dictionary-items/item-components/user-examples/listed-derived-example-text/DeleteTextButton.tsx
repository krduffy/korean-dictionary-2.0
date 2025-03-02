import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../../../shared-web-hooks/useCallAPIWeb";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { ErrorMessage } from "../../../../text-formatters/messages/ErrorMessage";
import { SuccessMessage } from "../../../../text-formatters/messages/SuccessMessage";
import { useEffect } from "react";
import { Button } from "../../../../ui/Button";
import { Trash2 } from "lucide-react";

export const DeleteTextButton = ({
  sourceTextPk,
  onDelete,
}: {
  sourceTextPk: number;
  onDelete: () => void;
}) => {
  const { callAPI, requestState } = useCallAPIWeb({ cacheResults: false });
  const { sendNotification } = useNotificationContext();

  const deleteUrl = getEndpoint({
    endpoint: "derived_examples_texts",
    pk: sourceTextPk,
  });

  const onClick = () => {
    callAPI(deleteUrl, {
      method: "DELETE",
    });
  };

  useEffect(() => {
    if (requestState.progress === "error") {
      sendNotification(<ErrorMessage error={requestState.response} />, 4000);
    } else if (requestState.progress === "success") {
      sendNotification(<SuccessMessage message="문서가 삭제됐습니다." />, 4000);
      onDelete();
    }
  }, [requestState]);

  return (
    <Button title="삭제" type="button" onClick={onClick}>
      <Trash2 />
    </Button>
  );
};
