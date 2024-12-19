import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";
import { usePopupBox } from "./usePopupBox";

export type BoxHashMark = "beginning" | "middle" | "end";
export type HashMarkAlignment =
  | "entirely-before"
  | "middles-aligned"
  | "entirely-after";

export type AlignmentConfig = {
  /** Whether the popup box should be positioned relative to the beginning,
   *  middle, or end of `relativeTo`. In the x direction, this moves from
   *  left to right. In the y direction, this moves from top to bottom.
   */
  relativeHashMark: BoxHashMark;
  /** Whether the popup box should be positioned so that it is entirely before
   *  (to the left/above) the `relativeHashMark`, aligned centrally with it, or
   *  entirely after it (to the right/below).
   */
  hashMarkAlignment: HashMarkAlignment;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type Positioning = {
  /** Popup box alignment in the y direction */
  horizontalAlignment: AlignmentConfig;
  /** Popup box alignment in the x direction */
  verticalAlignment: AlignmentConfig;
};

export type PopupBoxArgs = {
  /** The contents of the popup box. Should have a constant size.
   *  (If size is not constant, the popup box will move on resizes)
   */
  children: ReactNode;
  /** The element to position the popup box relative to. */
  relativeTo: HTMLElement | null;
  /** The positioning configuration of the popup box. */
  positioning: Positioning;
  /** A class name for the popup box. */
  className?: string;
};

export const PopupBox = ({
  children,
  relativeTo,
  positioning,
  className,
}: PopupBoxArgs) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { x, y } = usePopupBox({
    popupBoxRef: popupRef,
    relativeToBox: relativeTo ?? undefined,
    containingBox: document.body,
    positioning: positioning,
  });

  return createPortal(
    <div
      style={{
        left: x,
        top: y,
        position: "fixed",
        zIndex: 1000,
      }}
      ref={popupRef}
      className={`${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
