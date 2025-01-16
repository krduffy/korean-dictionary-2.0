import { ReactNode } from "react";

export const TitledPageContent = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="overflow-y-scroll h-full w-full border-[color:--accent-border-color] rounded-xl bg-[color:--background-secondary]">
      <div
        style={{
          fontSize: "200%",
        }}
        className="text-center bg-[color:--accent-7] rounded-md py-1"
      >
        {title}
      </div>
      <div className="w-full p-6">{children}</div>
    </div>
  );
};
