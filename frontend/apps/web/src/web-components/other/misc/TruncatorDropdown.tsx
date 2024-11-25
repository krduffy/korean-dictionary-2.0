import { useTruncatorDropdown } from "../../../web-hooks/useTruncatorDropdown";
import { ReactNode } from "react";

import "./truncator-dropdown-styles.css";
import { ChevronDown, ChevronUp } from "lucide-react";

/* most of this is taken exactly from original project which is why it uses plain css */

export const TruncatorDropdown = ({
  children,
  maxHeight,
  initialDropdownState = false,
  overrideScrollbackRef,
  onDropdownStateToggle,
}: {
  children: ReactNode;
  maxHeight: number;
  initialDropdownState?: boolean;
  overrideScrollbackRef?: React.RefObject<HTMLDivElement>;
  onDropdownStateToggle?: (isExpanded: boolean) => void;
}) => {
  const {
    isExpanded,
    showButton,
    handleClickBar,
    handleClickButton,
    contentRef,
    topLevelRef,
  } = useTruncatorDropdown({
    children: children,
    maxHeight: maxHeight,
    overrideScrollbackElement: overrideScrollbackRef?.current,
    initialDropdownState: initialDropdownState,
    onDropdownStateToggle: onDropdownStateToggle,
  });

  return (
    <div className="flex flex-row" ref={topLevelRef}>
      <div className="w-6 flex flex-col">
        <div
          className="flex flex-1 items-center justify-center"
          onClick={handleClickBar}
        >
          <div className="bg-gray-100 w-1 h-full"></div>
        </div>
        {showButton && (
          <div onClick={handleClickButton}>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        )}
      </div>

      <div
        style={{
          maxHeight: isExpanded ? "" : `${maxHeight}px`,
        }}
        className="overflow-y-hidden pl-1"
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};
