import { Coordinates, DOMRectlike, Range } from "./popupBoxTypes";

export function doPopupBoxPositionCoercion(
  movableBox: DOMRectlike,
  cannotOverlapWithBox: DOMRectlike,
  mustBeInsideBox: DOMRectlike
): Coordinates | null {
  const coercedX = getCoercedRangeFromBoxes(
    movableBox,
    cannotOverlapWithBox,
    mustBeInsideBox,
    "x"
  );

  if (coercedX === null) return null;

  const coercedY = getCoercedRangeFromBoxes(
    movableBox,
    cannotOverlapWithBox,
    mustBeInsideBox,
    "y"
  );

  if (coercedY === null) return null;

  return {
    x: coercedX.start,
    y: coercedY.start,
  };
}

function getCoercedRangeFromBoxes(
  movableBox: DOMRectlike,
  cannotOverlapWithBox: DOMRectlike,
  mustBeInsideBox: DOMRectlike,
  dimension: "x" | "y"
): Range | null {
  const lengthAttribute = dimension === "x" ? "width" : "height";

  const coercedHorizontalRange = getCoercedRange({
    movableRange: {
      start: movableBox[dimension],
      end: movableBox[dimension] + movableBox[lengthAttribute],
      length: movableBox[lengthAttribute],
    },
    mustBeInsideRange: {
      start: mustBeInsideBox[dimension],
      end: mustBeInsideBox[dimension] + mustBeInsideBox[lengthAttribute],
      length: mustBeInsideBox[lengthAttribute],
    },
    cannotOverlapWithRange: {
      start: cannotOverlapWithBox[dimension],
      end:
        cannotOverlapWithBox[dimension] + cannotOverlapWithBox[lengthAttribute],
      length: cannotOverlapWithBox[lengthAttribute],
    },
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
