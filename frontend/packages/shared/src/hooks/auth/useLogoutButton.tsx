import { ComponentType, ReactNode, useEffect } from "react";
import { useNotificationContext } from "../../contexts/NotificationContextProvider";
import { APIResponseType, UseCallAPIReturns } from "../../types/apiCallTypes";
import { getEndpoint } from "../../utils/apiAliases";
import { useDoLoginStatusUpdate } from "./useDoLoginStatusUpdate";

export const useLogoutButton = ({
  useCallAPIInstance,
  clearTokensInStorage,
  NotificationComponent,
  ErrorMessageComponent,
}: {
  useCallAPIInstance: UseCallAPIReturns;
  clearTokensInStorage: () => void;
  NotificationComponent: ComponentType<{ children: ReactNode }>;
  ErrorMessageComponent: ComponentType<{ error: APIResponseType | string }>;
}) => {
  const { requestState, callAPI } = useCallAPIInstance;
  const { sendNotification } = useNotificationContext();

  const url = getEndpoint({ endpoint: "logout" });

  const { doLoginStatusUpdate } = useDoLoginStatusUpdate();

  useEffect(() => {
    if (requestState.progress === "success") {
      sendNotification(
        <NotificationComponent>로그아웃하셨습니다.</NotificationComponent>,
        5000
      );
      clearTokensInStorage();
      doLoginStatusUpdate();
    } else if (requestState.progress === "error") {
      sendNotification(
        <NotificationComponent>
          <ErrorMessageComponent error={requestState.response} />
        </NotificationComponent>,
        5000
      );
    }
  }, [requestState]);

  const onClick = () => {
    callAPI(url, {
      method: "POST",
      credentials: "include",
    });
  };

  return { onClick };
};
