import { useRef } from "react";
import { HideableDropdownNoTruncation } from "../../ReusedFormatters";

export const HanjaDetailExplanation = ({
  explanation,
}: {
  explanation: string;
}) => {
  return (
    <HideableDropdownNoTruncation title="설명" initiallyDroppedDown={false}>
      <div>{explanation}</div>
    </HideableDropdownNoTruncation>
  );
};
