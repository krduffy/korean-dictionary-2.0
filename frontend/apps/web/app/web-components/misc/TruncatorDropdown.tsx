import { useTruncatorDropdown } from "app/web-hooks/useTruncatorDropdown";
import { ReactNode } from "react";

import "./truncator-dropdown-styles.css";

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
    overrideScrollbackRef: overrideScrollbackRef,
    initialDropdownState: initialDropdownState,
    onDropdownStateToggle: onDropdownStateToggle,
  });

  return (
    <div className="truncator-dropdown" ref={topLevelRef}>
      <div className="expansion-controller">
        <div
          className={
            showButton
              ? isExpanded
                ? "retract-line-shortened-expanded"
                : "retract-line-shortened-unexpanded"
              : "retract-line-unshortened"
          }
          onClick={handleClickBar}
        ></div>
        {showButton && (
          <div className="expand-button" onClick={handleClickButton}>
            {isExpanded ? "▲" : "▼"}
          </div>
        )}
      </div>

      <div
        className={isExpanded ? "content-entire" : "content-truncated"}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};
