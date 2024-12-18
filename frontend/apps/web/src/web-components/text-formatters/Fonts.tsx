import { ReactNode } from "react";

export const TraditionalKoreanText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
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

/** For text with characters from non-modern Korean. Without this wrapper, they
 *  will display as ?. */
export const NonModernKoreanText = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        fontFamily: "'Nanum Barun Gothic','New Gulim','새굴림','dotum','돋움'",
      }}
    >
      {children}
    </div>
  );
};

export const TraditionalHanjaText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
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
