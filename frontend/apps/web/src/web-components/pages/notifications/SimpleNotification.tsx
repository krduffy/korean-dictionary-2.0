import { ReactNode } from "react";

export const SimpleNotification = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center justify-center p-4">{children}</div>;
};
