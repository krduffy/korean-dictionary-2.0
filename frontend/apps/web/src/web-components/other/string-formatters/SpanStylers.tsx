import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
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
  return <span className="text-[130%]">{children}</span>;
};

export const ClickableLinkStyler = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <span className="cursor-pointer hover:underline">{children}</span>;
};

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

export const SpanPicture = ({ string }: { string: string }) => {
  return (
    <span className="inline-flex items-center justify-center w-full h-full overflow-hidden">
      {string}
    </span>
  );
};

export const Footnote = ({ children }: { children: ReactNode }) => {
  return <span className="text-[80%]">{children}</span>;
};

export const Source = ({ children }: { children: ReactNode }) => {
  return <Footnote>{children}</Footnote>;
};

export const Href = ({
  children,
  urlString,
}: {
  children: ReactNode;
  urlString: string;
}) => {
  const { sendNotification } = useNotificationContext();

  const failedMessage = (
    <div className="float items-center justify-center p-4">
      창을 열기가 실패했습니다.
    </div>
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    /* disabled to prevent 2 tabs from coming up */
    e.preventDefault();

    const tab = window.open(urlString);

    if (tab === null) {
      sendNotification(failedMessage, 2000);
    }
  };

  return (
    <a
      href={urlString}
      referrerPolicy="no-referrer"
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export const AccentedTextWithBorder = ({
  children,
  accentNumber,
}: {
  children: ReactNode;
  accentNumber: number;
}) => {
  return (
    <div
      className={`p-1 bg-[color:--accent-button-color] border-2 
        border-[color:--border-color] rounded-xl text-[color:--accent-button-text-color]
        `}
    >
      {children}
    </div>
  );
};
