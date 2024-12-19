import { ReactNode } from "react";

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

export type Positioning = {
  /** Popup box alignment in the y direction */
  horizontalAlignment: AlignmentConfig;
  /** Popup box alignment in the x direction */
  verticalAlignment: AlignmentConfig;
};

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

export type BoxHashMark = "beginning" | "middle" | "end";
export type HashMarkAlignment =
  | "entirely-before"
  | "middles-aligned"
  | "entirely-after";

export type Coordinates = {
  x: number;
  y: number;
};

export type DOMRectlike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Range = {
  start: number;
  end: number;
  length: number;
};

export type HeightAndWidth = {
  height: number;
  width: number;
};
