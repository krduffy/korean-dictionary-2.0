import { Coordinates, DOMRectlike, Range } from "./popupBoxTypes";

export function doPopupBoxPositionCoercion(
  movableBox: DOMRectlike,
  cannotOverlapWithBox: DOMRectlike,
  mustBeInsideBox: DOMRectlike
): Coordinates | null {
  const returnedCoords = {
    x: movableBox.x,
    y: movableBox.y,
  };

  const shouldMove = whichShouldMove(
    movableBox,
    cannotOverlapWithBox,
    mustBeInsideBox
  );

  if (shouldMove === null) {
    return returnedCoords;
  }

  const coercedRange = getCoercedRangeFromBoxes(
    movableBox,
    cannotOverlapWithBox,
    mustBeInsideBox,
    shouldMove
  );

  if (coercedRange === null) return null;

  returnedCoords[shouldMove] = coercedRange.start;

  return returnedCoords;
}

function whichShouldMove(
  movableBox: DOMRectlike,
  cannotOverlapWithBox: DOMRectlike,
  mustBeInsideBox: DOMRectlike
): "x" | "y" | null {
  if (
    !rangeContainsRange(
      rangeFromDOMRectLike(mustBeInsideBox, "x"),
      rangeFromDOMRectLike(movableBox, "x")
    )
  )
    return "x";

  if (
    !rangeContainsRange(
      rangeFromDOMRectLike(mustBeInsideBox, "y"),
      rangeFromDOMRectLike(movableBox, "y")
    )
  )
    return "y";

  const xDoesNotOverlap = rangesHaveNoOverlap(
    rangeFromDOMRectLike(cannotOverlapWithBox, "x"),
    rangeFromDOMRectLike(movableBox, "x")
  );
  const yDoesNotOverlap = rangesHaveNoOverlap(
    rangeFromDOMRectLike(cannotOverlapWithBox, "y"),
    rangeFromDOMRectLike(movableBox, "y")
  );

  if (xDoesNotOverlap || yDoesNotOverlap) return null;

  return "y";
}

function rangeFromDOMRectLike(domrectlike: DOMRectlike, dimension: "x" | "y") {
  const lengthAttribute = dimension === "x" ? "width" : "height";

  return {
    start: domrectlike[dimension],
    end: domrectlike[dimension] + domrectlike[lengthAttribute],
    length: domrectlike[lengthAttribute],
  };
}

function getCoercedRangeFromBoxes(
  movableBox: DOMRectlike,
  cannotOverlapWithBox: DOMRectlike,
  mustBeInsideBox: DOMRectlike,
  dimension: "x" | "y"
): Range | null {
  const coercedHorizontalRange = getCoercedRange({
    movableRange: rangeFromDOMRectLike(movableBox, dimension),
    mustBeInsideRange: rangeFromDOMRectLike(mustBeInsideBox, dimension),
    cannotOverlapWithRange: rangeFromDOMRectLike(
      cannotOverlapWithBox,
      dimension
    ),
  });

  return coercedHorizontalRange;
}

function rangeContainsRange(
  rangeThatContainsOther: Range,
  rangeThatIsContained: Range
) {
  return (
    rangeThatContainsOther.start <= rangeThatIsContained.start &&
    rangeThatContainsOther.end >= rangeThatIsContained.end
  );
}

export function rangesHaveNoOverlap(range1: Range, range2: Range) {
  return (
    (range2.start <= range1.start && range2.end <= range1.start) ||
    (range2.start >= range1.end && range2.end >= range1.end)
  );
}

export function coerceRangeDown(ranges: {
  movableRange: Range;
  mustBeInsideRange: Range;
  cannotOverlapWithRange: Range;
}): Range | null {
  if (ranges.mustBeInsideRange.start > ranges.cannotOverlapWithRange.start) {
    return null;
  }

  return moveRangeIntoOtherRange(ranges.movableRange, {
    start: ranges.mustBeInsideRange.start,
    end: ranges.cannotOverlapWithRange.start,
    length:
      ranges.cannotOverlapWithRange.start - ranges.mustBeInsideRange.start,
  });
}

export function coerceRangeUp(ranges: {
  movableRange: Range;
  mustBeInsideRange: Range;
  cannotOverlapWithRange: Range;
}): Range | null {
  if (ranges.mustBeInsideRange.end < ranges.cannotOverlapWithRange.end) {
    return null;
  }

  return moveRangeIntoOtherRange(ranges.movableRange, {
    start: ranges.cannotOverlapWithRange.end,
    end: ranges.mustBeInsideRange.end,
    length: ranges.mustBeInsideRange.end - ranges.cannotOverlapWithRange.end,
  });
}

export function getCoercedRange(ranges: {
  movableRange: Range;
  mustBeInsideRange: Range;
  cannotOverlapWithRange: Range;
}): Range | null {
  if (
    rangeContainsRange(ranges.mustBeInsideRange, ranges.movableRange) &&
    rangesHaveNoOverlap(ranges.cannotOverlapWithRange, ranges.movableRange)
  ) {
    return ranges.movableRange;
  }

  let coercedUp: Range | null = coerceRangeUp(ranges);
  let coercedDown: Range | null = coerceRangeDown(ranges);

  if (coercedUp === null && coercedDown === null) {
    return null;
  }

  if (coercedUp === null) return coercedDown;
  if (coercedDown === null) return coercedUp;

  const preferMovementUp =
    Math.abs(coercedUp.start - ranges.movableRange.start) <=
    Math.abs(coercedDown.start - ranges.movableRange.start);

  return preferMovementUp ? coercedUp : coercedDown;
}

export function moveRangeIntoOtherRange(
  movableRange: Range,
  mustBeInsideRange: Range
): Range | null {
  /* doesnt fit */
  if (movableRange.length > mustBeInsideRange.length) {
    return null;
  }

  /* already inside */
  if (rangeContainsRange(mustBeInsideRange, movableRange)) {
    return movableRange;
  }

  /* too low */
  if (movableRange.start < mustBeInsideRange.start) {
    return {
      ...movableRange,
      start: mustBeInsideRange.start,
      end: mustBeInsideRange.start + movableRange.length,
    };
  }

  /* too high */
  return {
    ...movableRange,
    end: mustBeInsideRange.end,
    start: mustBeInsideRange.end - movableRange.length,
  };
}
