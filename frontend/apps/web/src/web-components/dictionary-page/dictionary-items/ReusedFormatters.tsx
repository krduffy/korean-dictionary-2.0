import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode } from "react";
import { useTruncatorDropdown } from "../../../web-hooks/useTruncatorDropdown";
import { MeaningReadings } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";

export const MeaningReadingsDiv = ({
  meaningReadings,
}: {
  meaningReadings: MeaningReadings[];
}) => {
  return (
    <div>
      {meaningReadings.map((mr, id, arr) => (
        <span key={id}>
          <span>{mr.meaning} </span>
          <span className="[color:--accent-1]">{mr.readings.join("/")}</span>
          {id !== arr.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
};

export const HideableDropdownNoTruncation = ({
  title,
  droppedDown,
  onDropdownStateToggle,
  children,
}: {
  title: string;
  droppedDown: boolean;
  onDropdownStateToggle: (droppedDown: boolean) => void;
  children: ReactNode;
}) => {
  const { handleClickButton, contentRef, topLevelRef } = useTruncatorDropdown({
    children: children,
    maxHeight: 0,
    droppedDown: droppedDown,
    onDropdownStateToggle: onDropdownStateToggle,
  });

  return (
    <div className="w-full" ref={topLevelRef}>
      <div className="flex flex-row justify-between">
        <div className="text-[150%]">{title}</div>
        <div
          className="cursor-pointer"
          title={droppedDown ? "접기" : "펴기"}
          onClick={handleClickButton}
        >
          {droppedDown ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      <div
        style={{
          maxHeight: droppedDown ? "" : "0px",
        }}
        className="overflow-y-hidden"
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};
