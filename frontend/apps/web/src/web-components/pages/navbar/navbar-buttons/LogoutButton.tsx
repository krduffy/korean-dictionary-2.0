import { useLogoutButton } from "@repo/shared/hooks/auth/useLogoutButton";
import { SimpleNotification } from "../../notifications/SimpleNotification";
import { ErrorMessage } from "../../../text-formatters/messages/ErrorMessage";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { tokenHandlers } from "../../../../shared-web-hooks/tokenHandlers";
import { IconWithLabelButton } from "./IconWithLabelButton";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const { onClick } = useLogoutButton({
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    clearTokensInStorage: tokenHandlers.deleteTokens,
    NotificationComponent: SimpleNotification,
    ErrorMessageComponent: ErrorMessage,
  });

  return (
    <IconWithLabelButton
      icon={<LogOut />}
      onIconClick={onClick}
      label={"로그아웃"}
    />
  );
};
