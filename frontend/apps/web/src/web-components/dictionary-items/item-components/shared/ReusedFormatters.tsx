import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode } from "react";

export type HideableDropdownNoTruncationClasses = {
  topBarClassName: string;
  topBarStyles: React.CSSProperties;
  titleClassName: string;
  titleStyles: React.CSSProperties;
  childrenClassName: string;
  childrenStyles: React.CSSProperties;
};

export const HideableDropdownNoTruncation = ({
  title,
  disableDropdown = false,
  droppedDown,
  onDropdownStateToggle,
  classes,
  children,
}: {
  title: ReactNode;
  disableDropdown?: boolean;
  droppedDown: boolean;
  onDropdownStateToggle: (droppedDown: boolean) => void;
  classes?: Partial<HideableDropdownNoTruncationClasses> | undefined;
  children: ReactNode;
}) => {
  return (
    <div className="w-full">
      <div
        style={classes?.topBarStyles}
        className={`px-2 flex flex-row justify-between items-center 
          border-[color:--border-color] 
          ${droppedDown ? "rounded-t-xl border-t-2 border-x-2" : "rounded-xl border-2"}
           ${classes?.topBarClassName}`}
      >
        <div
          style={classes?.titleStyles}
          className={`${classes?.titleClassName}`}
        >
          {title}
        </div>
        {!disableDropdown && (
          <div
            className="cursor-pointer"
            title={droppedDown ? "접기" : "펴기"}
            onClick={() => onDropdownStateToggle(!droppedDown)}
          >
            {droppedDown ? <ChevronUp /> : <ChevronDown />}
          </div>
        )}
      </div>
      {droppedDown && (
        <div
          style={classes?.childrenStyles}
          className={`rounded-b-xl border-b-2 border-x-2 border-[color:--border-color]
             ${classes?.childrenClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DetailViewBaseDefaultHideableDropdownNoTruncation = ({
  title,
  droppedDown,
  onDropdownStateToggle,
  children,
}: {
  title: ReactNode;
  droppedDown: boolean;
  onDropdownStateToggle: (droppedDown: boolean) => void;
  children: ReactNode;
}) => {
  return (
    <HideableDropdownNoTruncation
      title={title}
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
      classes={{
        topBarClassName: "py-2 bg-[color:--understated-accent-not-hovering]",
        titleClassName: "text-[130%]",
        childrenClassName: "p-2 bg-[color:--background-quaternary]",
      }}
    >
      {children}
    </HideableDropdownNoTruncation>
  );
};
