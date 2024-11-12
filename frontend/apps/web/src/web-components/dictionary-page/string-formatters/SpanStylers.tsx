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

export const TraditionalKoreanText = ({ children, className = "" }) => {
  return (
    <span
      className={`font-serif ${className}`}
      style={{
        fontFamily:
          '"Nanum Myeongjo", "Gungseo", "Batang", "BatangChe", "UnBatang", serif',
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
};

export const TraditionalHanjaText = ({ children, className = "" }) => {
  return (
    <span
      className={`font-serif ${className}`}
      style={{
        fontFamily:
          '"Source Han Serif", "Nanum Myeongjo", "SimSun", "Ming", "MS Mincho", serif',
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </span>
  );
};
