import {
  coerceRangeDown,
  coerceRangeUp,
  doPopupBoxPositionCoercion,
  getCoercedRange,
  moveRangeIntoOtherRange,
  rangesHaveNoOverlap,
} from "../doPopupBoxPositionCoercion";
import { Coordinates, DOMRectlike, Range } from "../popupBoxTypes";

function getRandomCoordinates(
  numBoxes: number,
  boundaries: DOMRectlike
): Coordinates[] {
  return Array(numBoxes)
    .fill(null)
    .map((_) => ({
      x: Math.random() * (boundaries.width - boundaries.x) + boundaries.x,
      y: Math.random() * (boundaries.height - boundaries.y) + boundaries.y,
    }));
}

function boxContainsBox(
  boxToContainOther: DOMRectlike,
  boxToBeContained: DOMRectlike
) {
  return (
    boxToContainOther.x <= boxToBeContained.x &&
    boxToContainOther.x + boxToContainOther.width >=
      boxToBeContained.x + boxToBeContained.width &&
    boxToContainOther.y <= boxToBeContained.y &&
    boxToContainOther.y + boxToContainOther.height >= boxToBeContained.y
  );
}

function boxesNeverOverlap(box1: DOMRectlike, box2: DOMRectlike) {
  return (
    rangesHaveNoOverlap(
      {
        start: box1.x,
        end: box1.x + box1.width,
        length: box1.width,
      },
      { start: box2.x, end: box2.x + box2.width, length: box2.width }
    ) ||
    rangesHaveNoOverlap(
      {
        start: box1.y,
        end: box1.y + box1.height,
        length: box1.height,
      },
      { start: box2.y, end: box2.y + box2.height, length: box2.height }
    )
  );
}

describe("doPopupBoxPositionCoercion stochastic tests", () => {
  const mustBeInsideBox: DOMRectlike = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
  const cannotOverlapWithBox: DOMRectlike = {
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  };

  const randomBoxes = getRandomCoordinates(100, {
    x: -100,
    y: -100,
    width: 200,
    height: 200,
  }).map((coords) => ({ ...coords, height: 24, width: 24 }));

  randomBoxes.forEach((randomBox) => {
    const result = doPopupBoxPositionCoercion(
      randomBox,
      cannotOverlapWithBox,
      mustBeInsideBox
    );

    expect(result).not.toBeNull();
    const newBox = { ...randomBox, ...result };
    expect(boxesNeverOverlap(newBox, cannotOverlapWithBox)).toBe(true);
    expect(boxContainsBox(mustBeInsideBox, newBox)).toBe(true);
  });

  const boxesThatAreTooBig = randomBoxes.map((box) => ({
    ...box,
    height: 50,
    width: 50,
  }));

  boxesThatAreTooBig.forEach((randomBox) => {
    const result = doPopupBoxPositionCoercion(
      randomBox,
      cannotOverlapWithBox,
      mustBeInsideBox
    );

    expect(result).toBeNull();
  });
});

describe("doPopupBoxPositionCoercion base cases", () => {
  it("should return null when box cannot be coerced", () => {
    const movableBox: DOMRectlike = { x: 0, y: 0, width: 100, height: 100 };
    const cannotOverlapWithBox: DOMRectlike = {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
    };
    const mustBeInsideBox: DOMRectlike = {
      x: 0,
      y: 0,
      width: 150,
      height: 150,
    };

    const result = doPopupBoxPositionCoercion(
      movableBox,
      cannotOverlapWithBox,
      mustBeInsideBox
    );
    expect(result).toBeNull();
  });

  it("should not move box when already in valid position", () => {
    const movableBox: DOMRectlike = { x: 0, y: 0, width: 50, height: 50 };
    const cannotOverlapWithBox: DOMRectlike = {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    };
    const mustBeInsideBox: DOMRectlike = {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
    };

    const result = doPopupBoxPositionCoercion(
      movableBox,
      cannotOverlapWithBox,
      mustBeInsideBox
    );
    expect(result).toEqual({ x: 0, y: 0 });
  });
});

describe("getCoercedRange", () => {
  it("should return original range when valid", () => {
    const movableRange: Range = { start: 10, end: 20, length: 10 };
    const mustBeInsideRange: Range = { start: 0, end: 100, length: 100 };
    const cannotOverlapWithRange: Range = { start: 50, end: 60, length: 10 };

    const result = getCoercedRange({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange,
    });
    expect(result).toEqual(movableRange);
  });

  it("should coerce range down when closer than up", () => {
    const movableRange: Range = { start: 45, end: 55, length: 10 };
    const mustBeInsideRange: Range = { start: 0, end: 100, length: 100 };
    const cannotOverlapWithRange: Range = { start: 50, end: 60, length: 10 };

    const result = getCoercedRange({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange,
    });
    expect(result?.start).toBe(40);
    expect(result?.end).toBe(50);
    expect(result?.length).toBe(10);
  });

  it("should coerce range up when closer than down", () => {
    const movableRange: Range = { start: 55, end: 65, length: 10 };
    const mustBeInsideRange: Range = { start: 0, end: 100, length: 100 };
    const cannotOverlapWithRange: Range = { start: 50, end: 60, length: 10 };

    const result = getCoercedRange({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange,
    });
    expect(result?.start).toBe(60);
    expect(result?.end).toBe(70);
    expect(result?.length).toBe(10);
  });

  it("should return null when range cannot be coerced", () => {
    const movableRange: Range = { start: 0, end: 30, length: 30 };
    const mustBeInsideRange: Range = { start: 0, end: 20, length: 20 };
    const cannotOverlapWithRange: Range = { start: 5, end: 15, length: 10 };

    const result = getCoercedRange({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange,
    });
    expect(result).toBeNull();
  });
});

describe("rangesHaveNoOverlap", () => {
  const testCases = [
    {
      range1: { start: 0, end: 10, length: 10 },
      range2: { start: 20, end: 30, length: 10 },
      expected: true,
      description: "ranges are completely separate",
    },
    {
      range1: { start: 0, end: 10, length: 10 },
      range2: { start: 5, end: 15, length: 10 },
      expected: false,
      description: "ranges partially overlap",
    },
    {
      range1: { start: 0, end: 10, length: 10 },
      range2: { start: 0, end: 10, length: 10 },
      expected: false,
      description: "ranges are identical",
    },
    {
      range1: { start: 10, end: 20, length: 10 },
      range2: { start: 0, end: 10, length: 10 },
      expected: true,
      description: "ranges touch but do not overlap",
    },
  ];

  testCases.forEach(({ range1, range2, expected, description }) => {
    it(`should return ${expected} when ${description}`, () => {
      expect(rangesHaveNoOverlap(range1, range2)).toBe(expected);
    });
  });
});

describe("coerceRangeDown", () => {
  const movableRange: Range = { start: 25, end: 50, length: 25 };
  const mustBeInsideRange: Range = { start: 0, end: 100, length: 100 };
  const cannotOverlapWithRange: Range = { start: 25, end: 75, length: 50 };

  it("correctly moves a range down", () => {
    const result = coerceRangeDown({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange,
    });
    expect(result?.start).toBe(0);
    expect(result?.end).toBe(25);
    expect(result?.length).toBe(25);
  });

  it("correctly returns null when coercion down is impossible", () => {
    const result = coerceRangeDown({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange: { start: 10, end: 70, length: 60 },
    });
    expect(result).toBeNull();
  });
});

describe("coerceRangeUp", () => {
  const movableRange: Range = { start: 25, end: 50, length: 25 };
  const mustBeInsideRange: Range = { start: 0, end: 100, length: 100 };
  const cannotOverlapWithRange: Range = { start: 25, end: 75, length: 50 };

  it("correctly moves a range up", () => {
    const result = coerceRangeUp({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange,
    });
    expect(result?.start).toBe(75);
    expect(result?.end).toBe(100);
    expect(result?.length).toBe(25);
  });

  it("correctly returns null when coercion down is impossible", () => {
    const result = coerceRangeUp({
      movableRange,
      mustBeInsideRange,
      cannotOverlapWithRange: { start: 30, end: 80, length: 50 },
    });
    expect(result).toBeNull();
  });
});

describe("moveRangeIntoOtherRange", () => {
  const testCases = [
    {
      movableRange: { start: 0, end: 10, length: 10 },
      mustBeInsideRange: { start: 0, end: 30, length: 30 },
      expected: { start: 0, end: 10, length: 10 },
      description: "movableRange is already in mustBeInsideRange",
    },
    {
      movableRange: { start: 50, end: 70, length: 20 },
      mustBeInsideRange: { start: 0, end: 30, length: 30 },
      expected: { start: 10, end: 30, length: 20 },
      description: "movableRange needs to be moved down",
    },
    {
      movableRange: { start: 0, end: 10, length: 10 },
      mustBeInsideRange: { start: 20, end: 30, length: 10 },
      expected: { start: 20, end: 30, length: 10 },
      description: "movableRange needs to be moved up",
    },
    {
      movableRange: { start: 15, end: 25, length: 10 },
      mustBeInsideRange: { start: 20, end: 30, length: 10 },
      expected: { start: 20, end: 30, length: 10 },
      description: `movableRange is overlapping with mustBeInsideRange 
                    but needs to be moved up`,
    },
    {
      movableRange: { start: 25, end: 35, length: 10 },
      mustBeInsideRange: { start: 20, end: 30, length: 10 },
      expected: { start: 20, end: 30, length: 10 },
      description: `movableRange is overlapping with mustBeInsideRange 
                    but needs to be moved down`,
    },
  ];

  testCases.forEach(
    ({ movableRange, mustBeInsideRange, expected, description }) => {
      it(`should return correct range when ${description}`, () => {
        expect(
          moveRangeIntoOtherRange(movableRange, mustBeInsideRange)
        ).toEqual(expected);
      });
    }
  );
});
