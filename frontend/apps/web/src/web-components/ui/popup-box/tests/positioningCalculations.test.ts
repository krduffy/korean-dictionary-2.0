import { HashMarkAlignment, BoxHashMark } from "../PopupBox";
import {
  coercePopupCoordsInsideBox,
  DOMRectlike,
  getBaseCoord,
} from "../positioningCalculations";

const testGetBaseCoord = () =>
  describe("getBaseCoord", () => {
    const inputs = [
      { args: [0, 100, 20, "beginning", "entirely-before"], expected: -20 },
      { args: [0, 100, 20, "beginning", "entirely-after"], expected: 0 },
      { args: [0, 100, 20, "beginning", "middles-aligned"], expected: -10 },
      { args: [0, 100, 20, "end", "entirely-before"], expected: 80 },
      { args: [0, 100, 20, "end", "entirely-after"], expected: 100 },
      { args: [0, 100, 20, "end", "middles-aligned"], expected: 90 },
      { args: [0, 100, 20, "middle", "entirely-before"], expected: 30 },
      { args: [0, 100, 20, "middle", "entirely-after"], expected: 50 },
      { args: [0, 100, 20, "middle", "middles-aligned"], expected: 40 },
    ] as {
      args: [number, number, number, BoxHashMark, HashMarkAlignment];
      expected: number;
    }[];

    test.each(inputs)("case $args", ({ args, expected }) => {
      expect(getBaseCoord(...args)).toBe(expected);
    });
  });

const testCoercePopupCoordsInsideBox = () =>
  describe("coercePopupCoordsInsideBox", () => {
    const containingBox: DOMRectlike = { x: 0, y: 0, width: 1000, height: 800 };

    it("should return same coords when popup fits completely inside box", () => {
      const initialPopupBox = { x: 100, y: 100, width: 200, height: 150 };
      const result = coercePopupCoordsInsideBox(containingBox, initialPopupBox);
      expect(result.x).toEqual(initialPopupBox.x);
      expect(result.y).toEqual(initialPopupBox.y);
    });

    it("should adjust x coordinate when popup would overflow right edge", () => {
      const initialPopupBox = { x: 900, y: 100, width: 200, height: 150 };
      const result = coercePopupCoordsInsideBox(containingBox, initialPopupBox);
      /* 1000 - 200 */
      expect(result.x).toBe(800);
      expect(result.y).toBe(100);
    });

    it("should adjust y coordinate when popup would overflow bottom edge", () => {
      const initialPopupBox: DOMRectlike = {
        x: 100,
        y: 700,
        width: 200,
        height: 150,
      };
      const result = coercePopupCoordsInsideBox(containingBox, initialPopupBox);
      expect(result.x).toBe(100);
      /* 800 - 150 */
      expect(result.y).toBe(650);
    });

    it("should throw error when popup box is larger than containing box", () => {
      const initialPopupBox = { x: 0, y: 0, width: 1200, height: 150 };
      expect(() =>
        coercePopupCoordsInsideBox(containingBox, initialPopupBox)
      ).toThrow();
    });

    it("should handle containing box not starting at (0, 0)", () => {
      const offsetBox = { x: 50, y: 50, width: 1000, height: 800 };
      const initialPopupBox = { x: 40, y: 40, width: 200, height: 150 };
      const result = coercePopupCoordsInsideBox(offsetBox, initialPopupBox);
      /* both of them moved to be the top left of the box */
      expect(result.x).toBe(50);
      expect(result.y).toBe(50);
    });
  });

describe("positioningCalculations", () => {
  testGetBaseCoord();
  testCoercePopupCoordsInsideBox();
});
