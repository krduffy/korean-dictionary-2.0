import {
  HashMarkAlignment,
  BoxHashMark,
  Coordinates,
  Positioning,
} from "./PopupBox";

export type DOMRectlike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HeightAndWidth = {
  height: number;
  width: number;
};

export function getBaseCoord(
  relativeDomStart: number,
  relativeDomLength: number,
  popupLength: number,
  relativeHashMark: BoxHashMark,
  hashMarkAlignment: HashMarkAlignment
): number {
  let relativeX: number;
  switch (relativeHashMark) {
    case "beginning":
      relativeX = relativeDomStart;
      break;
    case "end":
      relativeX = relativeDomStart + relativeDomLength;
      break;
    case "middle":
      relativeX = relativeDomStart + relativeDomLength / 2;
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

export function coercePopupCoordsInsideBox(
  containingBox: DOMRectlike,
  popupBox: DOMRectlike
): Coordinates {
  if (
    popupBox.width > containingBox.width ||
    popupBox.height > containingBox.height
  ) {
    throw new Error("Popup box does not fit in containing box");
  }

  const newCoords: Coordinates = { x: popupBox.x, y: popupBox.y };

  /* Check containing box left edge */
  if (containingBox.x > popupBox.x) {
    newCoords.x = containingBox.x;
  }

  /* Check containing box right edge */
  if (popupBox.x + popupBox.width > containingBox.x + containingBox.width) {
    newCoords.x = containingBox.width + containingBox.x - popupBox.width;
  }

  /* Check containing box top edge */
  if (containingBox.y > popupBox.y) {
    newCoords.y = containingBox.y;
  }

  /* Check containing box bottom edge */
  if (popupBox.y + popupBox.height > containingBox.y + containingBox.height) {
    newCoords.y = containingBox.height + containingBox.y - popupBox.height;
  }

  return newCoords;
}

function getInitialRelativePlacement(
  popupBoxDimensions: HeightAndWidth,
  relativeBox: DOMRectlike,
  positioning: Positioning
): Coordinates {
  return {
    x: getBaseCoord(
      relativeBox.x,
      relativeBox.width,
      popupBoxDimensions.width,
      positioning.horizontalAlignment.relativeHashMark,
      positioning.horizontalAlignment.hashMarkAlignment
    ),
    y: getBaseCoord(
      relativeBox.y,
      relativeBox.height,
      popupBoxDimensions.height,
      positioning.verticalAlignment.relativeHashMark,
      positioning.verticalAlignment.hashMarkAlignment
    ),
  };
}

export function getCoords(
  popupBoxDimensions: HeightAndWidth,
  relativeBox: DOMRectlike,
  positioning: Positioning,
  containingBox?: DOMRectlike
): Coordinates {
  const initialRelativePlacement: Coordinates = getInitialRelativePlacement(
    popupBoxDimensions,
    relativeBox,
    positioning
  );

  if (containingBox === undefined) {
    return {
      x: initialRelativePlacement.x,
      y: initialRelativePlacement.y,
    };
  }

  return coercePopupCoordsInsideBox(containingBox, {
    ...initialRelativePlacement,
    ...popupBoxDimensions,
  });
}
