import { ReactNode } from "react";

export const Button = ({
  children,
  type,
  title,
  onClick,
}: {
  children: ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      className="p-2 border-2 rounded-md 
                 bg-[color:--button-color] 
                 color-[color:--button-text-color] 
                 hover:bg-[color:--button-hover-color] 
                 border-[color:--border-color]"
      type={type}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
