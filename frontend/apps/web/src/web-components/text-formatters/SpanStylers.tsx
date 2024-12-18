import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { ReactNode } from "react";
import "./span-stylers.css";

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

export const DetailViewLinkStyler = ({ children }: { children: ReactNode }) => {
  return (
    <span
      // text shadow on hover in span-stylers.css
      className="cursor-pointer accent-1-text-shadow-on-hover"
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
