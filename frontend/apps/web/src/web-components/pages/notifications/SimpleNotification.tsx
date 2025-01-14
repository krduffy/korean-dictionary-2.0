import { ReactNode } from "react";

export const SimpleNotification = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
};
