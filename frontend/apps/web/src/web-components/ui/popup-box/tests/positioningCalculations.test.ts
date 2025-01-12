import { BoxHashMark, HashMarkAlignment, Range } from "../popupBoxTypes";
import { getBaseCoord } from "../positioningCalculations";

describe("positioningCalculations", () => {
  const range: Range = {
    start: 0,
    end: 100,
    length: 100,
  };
  const inputs = [
    { args: [range, 20, "beginning", "entirely-before"], expected: -20 },
    { args: [range, 20, "beginning", "entirely-after"], expected: 0 },
    { args: [range, 20, "beginning", "middles-aligned"], expected: -10 },
    { args: [range, 20, "end", "entirely-before"], expected: 80 },
    { args: [range, 20, "end", "entirely-after"], expected: 100 },
    { args: [range, 20, "end", "middles-aligned"], expected: 90 },
    { args: [range, 20, "middle", "entirely-before"], expected: 30 },
    { args: [range, 20, "middle", "entirely-after"], expected: 50 },
    { args: [range, 20, "middle", "middles-aligned"], expected: 40 },
  ] as {
    args: [Range, number, BoxHashMark, HashMarkAlignment];
    expected: number;
  }[];

  it.each(inputs)(
    "should correctly get the base coordinates for case $args",
    ({ args, expected }) => {
      expect(getBaseCoord(...args)).toBe(expected);
    }
  );
});
