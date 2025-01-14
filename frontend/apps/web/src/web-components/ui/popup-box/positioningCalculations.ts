import {
  Positioning,
  BoxHashMark,
  HashMarkAlignment,
  Coordinates,
  DOMRectlike,
  Range,
  HeightAndWidth,
} from "./popupBoxTypes";

import { doPopupBoxPositionCoercion } from "./doPopupBoxPositionCoercion";

export function getCoords(
  popupBoxDimensions: HeightAndWidth,
  relativeBox: DOMRectlike,
  containingBox: DOMRectlike,
  positioning: Positioning
): Coordinates | null {
  const initialRelativePlacement: Coordinates = getInitialRelativePlacement(
    popupBoxDimensions,
    relativeBox,
    positioning
  );

  const coerced = doPopupBoxPositionCoercion(
    { ...initialRelativePlacement, ...popupBoxDimensions },
    relativeBox,
    containingBox
  );

  return coerced;
}

function getInitialRelativePlacement(
  popupBoxDimensions: HeightAndWidth,
  relativeBox: DOMRectlike,
  positioning: Positioning
): Coordinates {
  return {
    x: getBaseCoord(
      {
        start: relativeBox.x,
        end: relativeBox.x + relativeBox.width,
        length: relativeBox.width,
      },
      popupBoxDimensions.width,
      positioning.horizontalAlignment.relativeHashMark,
      positioning.horizontalAlignment.hashMarkAlignment
    ),
    y: getBaseCoord(
      {
        start: relativeBox.y,
        end: relativeBox.y + relativeBox.height,
        length: relativeBox.height,
      },
      popupBoxDimensions.height,
      positioning.verticalAlignment.relativeHashMark,
      positioning.verticalAlignment.hashMarkAlignment
    ),
  };
}

export function getBaseCoord(
  relativeElementAxisRange: Range,
  popupLength: number,
  relativeHashMark: BoxHashMark,
  hashMarkAlignment: HashMarkAlignment
): number {
  let relativeX: number;

  switch (relativeHashMark) {
    case "beginning":
      relativeX = relativeElementAxisRange.start;
      break;
    case "end":
      relativeX = relativeElementAxisRange.end;
      break;
    case "middle":
      relativeX =
        (relativeElementAxisRange.start + relativeElementAxisRange.end) / 2;
  }

  switch (hashMarkAlignment) {
    case "entirely-before":
      return relativeX - popupLength;
    case "entirely-after":
      return relativeX;
    case "middles-aligned":
      return relativeX - popupLength / 2;
  }
}
