import { ReactNode } from "react";

export const SearchResultStyler = ({ children }: { children: ReactNode }) => {
  return (
    <span className="text-[170%] text-[color:--accent-1] cursor-pointer">
      {children}
    </span>
  );
};

export const SearchResultSideInfoStyler = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <span className="text-[110%]">{children}</span>;
};

export const ClickableLinkStyler = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <span className="hover:underline">{children}</span>;
};
