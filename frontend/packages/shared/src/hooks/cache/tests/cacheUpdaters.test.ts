import { it, describe, expect } from "@jest/globals";
import { withUpdatedKnownStudied } from "../responseUpdaters";

const dataItem = {
  a: ["b", "c", "def", "g"],
  h: 4,
  n: [
    {
      x: 4,
    },
  ],
  response: [
    {
      field1: "q",
      user_data: {
        is_known: true,
        is_studied: false,
      },
    },
    {
      field1: "u",
      user_data: {
        is_known: false,
        is_studied: true,
      },
    },
  ],
};

const expectedAfterUpdateKnown = {
  a: ["b", "c", "def", "g"],
  h: 4,
  n: [
    {
      x: 4,
    },
  ],
  response: [
    {
      field1: "q",
      user_data: {
        is_known: false,
        is_studied: false,
      },
    },
    {
      field1: "u",
      user_data: {
        is_known: false,
        is_studied: true,
      },
    },
  ],
};

describe("cacheUpdaters", () => {
  it("can update known on an item", () => {
    const updated = withUpdatedKnownStudied({
      fullResponse: dataItem,
      pathToKnownStudied: ["response", 0, "user_data"],
      knownOrStudied: "known",
      newValue: false,
    });

    expect(updated).toEqual(expectedAfterUpdateKnown);
  });
});
