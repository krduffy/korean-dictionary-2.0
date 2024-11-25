import { ReactNode } from "react";

export const DetailedSectionBox = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div>
      <div
        style={{ fontSize: "135%", borderWidth: "1px" }}
        className="border-[color:--accent-4] py-2 pl-4 my-4 bg-[color:--accent-7] rounded-lg"
      >
        {title}
      </div>
      <div className="pl-4">{children}</div>
    </div>
  );
};
