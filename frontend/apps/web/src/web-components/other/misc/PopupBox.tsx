import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Position = "top" | "bottom" | "left" | "right" | "center";
type Alignment = "start" | "center" | "end";

export interface PopupBoxArgs {
  /** The content to show in the popup. */
  children: React.ReactNode;
  /** The target element to position relative to. */
  targetElement: HTMLElement | null;
  /** Primary position of the popup relative to the target. */
  position?: Position;
  /** Alignment along the secondary axis. */
  align?: Alignment;
  /** Spacing between popup and target element in pixels. */
  offset?: number;
  /** Whether the popup should stay within window bounds. */
  constrainToWindow?: boolean;
  /** Optional className for the popup container. */
  className?: string;
  /** Whether the popup is currently visible. */
  isVisible?: boolean;
}

export const PopupBox = ({
  children,
  targetElement,
  position = "bottom",
  align = "center",
  offset = 8,
  constrainToWindow = true,
  className = "",
  isVisible = true,
}: PopupBoxArgs) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!isVisible || !targetElement || !popupRef.current) return;

    const updatePosition = () => {
      const targetRect = targetElement.getBoundingClientRect();
      const popupRect = popupRef.current!.getBoundingClientRect();

      let x = 0;
      let y = 0;

      // Calculate base position
      switch (position) {
        case "top":
          y = targetRect.top - popupRect.height - offset;
          break;
        case "bottom":
          y = targetRect.bottom + offset;
          break;
        case "left":
          x = targetRect.left - popupRect.width - offset;
          break;
        case "right":
          x = targetRect.right + offset;
          break;
        case "center":
          x = targetRect.left + (targetRect.width - popupRect.width) / 2;
          y = targetRect.top + (targetRect.height - popupRect.height) / 2;
          break;
      }

      // Calculate alignment
      if (position === "top" || position === "bottom") {
        switch (align) {
          case "start":
            x = targetRect.left;
            break;
          case "center":
            x = targetRect.left + (targetRect.width - popupRect.width) / 2;
            break;
          case "end":
            x = targetRect.right - popupRect.width;
            break;
        }
      } else if (position === "left" || position === "right") {
        switch (align) {
          case "start":
            y = targetRect.top;
            break;
          case "center":
            y = targetRect.top + (targetRect.height - popupRect.height) / 2;
            break;
          case "end":
            y = targetRect.bottom - popupRect.height;
            break;
        }
      }

      // Constrain to window bounds if needed
      if (constrainToWindow) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        x = Math.max(
          offset,
          Math.min(x, windowWidth - popupRect.width - offset)
        );
        y = Math.max(
          offset,
          Math.min(y, windowHeight - popupRect.height - offset)
        );
      }

      setCoordinates({ x, y });
    };

    updatePosition();

    // Add resize and scroll listeners for repositioning
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [targetElement, position, align, offset, constrainToWindow, isVisible]);

  if (!isVisible) return null;

  const eatMouseInput = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return createPortal(
    <div
      ref={popupRef}
      className={`fixed ${className}`}
      style={{
        left: coordinates.x,
        top: coordinates.y,
        zIndex: 1000,
      }}
      onClick={eatMouseInput}
      onMouseDown={eatMouseInput}
      onMouseEnter={eatMouseInput}
      onMouseOut={eatMouseInput}
      onMouseLeave={eatMouseInput}
    >
      {children}
    </div>,
    document.body
  );
};
