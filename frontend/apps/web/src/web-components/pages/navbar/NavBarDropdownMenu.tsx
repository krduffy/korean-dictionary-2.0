import { ReactNode } from "react";

export const NavBarDropdownMenu = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="pb-4 px-4
                 bg-[color:--background-tertiary]
                 border-2 border-[color:--accent-border-color]"
    >
      {children}
    </div>
  );
};
