import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

export type NotificationType = {
  id: number;
  message: ReactNode;
  autoDeleteAfterMs?: number;
};

export type NotificationContextType = {
  notifications: NotificationType[];
  sendNotification: (message: ReactNode, autoDisappearAfterMs?: number) => void;
  clearNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const sendNotification = (message: ReactNode, autoDeleteAfterMs?: number) => {
    const id = Date.now();

    setNotifications((prev) =>
      prev.concat([{ id, message, autoDeleteAfterMs }])
    );
  };

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        sendNotification,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a context provider."
    );
  }
  return context;
};
