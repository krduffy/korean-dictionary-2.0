import { NavBar } from "./NavBar";

export const PageWithNavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[10%]">
        <NavBar />
      </div>
      <div className="h-[90%]">{children}</div>
    </div>
  );
};
