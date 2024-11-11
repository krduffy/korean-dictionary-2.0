import { ReactNode, useEffect, useRef, useState } from "react";

export const useTruncatorDropdown = ({
  children,
  maxHeight,
  overrideScrollbackRef,
  initialDropdownState,
  onDropdownStateToggle,
}: {
  children: ReactNode;
  maxHeight: number;
  overrideScrollbackRef?: React.RefObject<HTMLDivElement>;
  initialDropdownState: boolean;
  onDropdownStateToggle?: (isExpanded: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(initialDropdownState);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const topLevelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.getBoundingClientRect().height;
      setShowButton(contentHeight >= maxHeight);
    }
  }, [children]);

  const onCollapse = () => {
    let scrollbackRef = overrideScrollbackRef?.current || topLevelRef.current;

    if (scrollbackRef) {
      const bcr = scrollbackRef.getBoundingClientRect();

      if (bcr.top < 0 || bcr.top > window.innerHeight) {
        scrollbackRef.scrollIntoView({
          behavior: "instant",
        });
      }
    }
  };

  useEffect(() => {
    onDropdownStateToggle?.(isExpanded);
  }, [isExpanded]);

  const handleClickButton = () => {
    if (isExpanded) {
      onCollapse();
    }
    setIsExpanded(!isExpanded);
  };

  const handleClickBar = () => {
    if (isExpanded) {
      onCollapse();
    }
    setIsExpanded(false);
  };

  return {
    isExpanded,
    showButton,
    handleClickBar,
    handleClickButton,
    contentRef,
    topLevelRef,
  };
};
