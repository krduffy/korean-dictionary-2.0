import { ReactNode, useLayoutEffect, useRef, useState } from "react";

export const useTruncatorDropdown = ({
  children,
  maxHeight,
  overrideScrollbackElement,
  droppedDown,
  onDropdownStateToggle,
}: {
  children: ReactNode;
  /** The maximum height of `children` before truncation. */
  maxHeight: number;
  /** An override for the dev on which `scrollTo` is called when the truncator is collapsed. By default, a wrapper div around `children` is scrolled back to. */
  overrideScrollbackElement?: HTMLElement | null;
  /** Whether the dropdown is expanded or not. */
  droppedDown: boolean;
  /** A function that is called with `isExpanded`. */
  onDropdownStateToggle: (isExpanded: boolean) => void;
}) => {
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const topLevelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.getBoundingClientRect().height;
      setShowButton(contentHeight >= maxHeight);
    }
  }, [children]);

  /**
   * Scrolls back to top of `children` or `overrideScrollbackRef`.
   */
  const onCollapse = () => {
    let scrollbackElement = overrideScrollbackElement || topLevelRef.current;

    if (scrollbackElement) {
      const bcr = scrollbackElement.getBoundingClientRect();

      /* if off screen */
      if (
        bcr.top < 0 ||
        (window?.innerHeight && bcr.top > window.innerHeight)
      ) {
        scrollbackElement.scrollIntoView({
          behavior: "instant",
        });
      }
    }
  };

  const handleClickButton = () => {
    if (droppedDown) {
      onCollapse();
    }

    const newValue = !droppedDown;
    onDropdownStateToggle(newValue);
  };

  const handleClickBar = () => {
    if (droppedDown) {
      onCollapse();
    }
    onDropdownStateToggle(false);
  };

  return {
    showButton,
    handleClickBar,
    handleClickButton,
    contentRef,
    topLevelRef,
  };
};
