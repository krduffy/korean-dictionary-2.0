import { useTruncatorDropdown } from "../../../web-hooks/useTruncatorDropdown";
import { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
      <ExpansionController
        isExpanded={isExpanded}
        showButton={showButton}
        handleClickBar={handleClickBar}
        handleClickButton={handleClickButton}
      />

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

const ExpansionController = ({
  isExpanded,
  showButton,
  handleClickBar,
  handleClickButton,
}: {
  isExpanded: boolean;
  showButton: boolean;
  handleClickBar: () => void;
  handleClickButton: () => void;
}) => {
  return (
    <div className="w-6 flex flex-col">
      <div
        className="flex flex-1 items-center justify-center"
        title={isExpanded ? "접기" : undefined}
        style={{ cursor: isExpanded ? "pointer" : "auto" }}
        onClick={handleClickBar}
      >
        <div className="bg-[color:--text-tertiary] w-1 h-full"></div>
      </div>
      {showButton && (
        <div
          onClick={handleClickButton}
          className="color-[color:--text-tertiary] hover:color-[color:--text-secondary] cursor-pointer"
        >
          {isExpanded ? (
            <div title="접기">
              <ChevronUp />
            </div>
          ) : (
            <div title="펴기">
              <ChevronDown />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
