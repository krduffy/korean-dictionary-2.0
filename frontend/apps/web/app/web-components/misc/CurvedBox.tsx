import { ReactNode } from "react";

export const CurvedBox = ({
  children,
  bgColor,
}: {
  children: ReactNode;
  bgColor: string;
}) => {
  return (
    <div
      className={`bg-[color:${bgColor}] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20 p-1`}
    >
      {children}
    </div>
  );
};
