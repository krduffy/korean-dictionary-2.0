import { memo, useEffect, useRef, useState } from "react";
import {
  NotificationType,
  useNotificationContext,
} from "@repo/shared/contexts/NotificationContextProvider";

import "./notification.css";
import { CloseButton } from "../../ui/CloseButton";

export const Notifications = () => {
  const { notifications, clearNotification } = useNotificationContext();

  return (
    <div className="flex justify-center">
      <div className="flex absolute z-50 bottom-0 w-[33%] flex-col gap-2 pb-2">
        <StackedNotifications
          notifications={notifications}
          clearNotification={clearNotification}
        />
      </div>
    </div>
  );
};

const StackedNotifications = memo(
  ({
    notifications,
    clearNotification,
  }: {
    notifications: NotificationType[];
    clearNotification: (id: number) => void;
  }) => {
    return notifications.map((notif: NotificationType) => (
      <RisingNotification
        key={notif.id}
        notification={notif}
        clearSelf={() => clearNotification(notif.id)}
      />
    ));
  }
);

const RisingNotification = memo(
  ({
    notification,
    clearSelf,
  }: {
    notification: NotificationType;
    clearSelf: () => void;
  }) => {
    const deletionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isDisappearing, setIsDisappearing] = useState(false);

    useEffect(() => {
      if (notification.autoDeleteAfterMs) {
        deletionTimer.current = setTimeout(
          () => doFadeOutThenRemove(),
          notification.autoDeleteAfterMs
        );
      }

      return () => {
        if (deletionTimer.current) clearTimeout(deletionTimer.current);
      };
    }, []);

    const doFadeOutThenRemove = () => {
      setIsDisappearing(true);
      setTimeout(() => {
        clearSelf();
        /* 1000 is length of animation fade out */
      }, 1000);
    };

    return (
      <div
        className={`p-2 relative top-0 h-full w-full bg-[color:--neutral-color-not-hovering] font-[color:--text-tertiary] rounded-3xl animate-rise-in ${isDisappearing ? "animate-fade-out" : ""}`}
      >
        {notification.message}
        <CloseButton onClick={() => doFadeOutThenRemove()} />
      </div>
    );
  }
);
