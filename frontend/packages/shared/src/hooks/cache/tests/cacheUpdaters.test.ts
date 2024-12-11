import { withUpdatedKnownStudied } from "../cacheUpdaters";

const dataItem = {
  a: ["b", "c", "def", "g"],
  h: 4,
  n: [
    {
      x: 4,
    },
  ],
  searchResults: [
    {
      field1: "q",
      user_data: {
        known: true,
        studied: false,
      },
    },
    {
      field1: "u",
      user_data: {
        known: false,
        studied: true,
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
  searchResults: [
    {
      field1: "q",
      user_data: {
        known: false,
        studied: false,
      },
    },
    {
      field1: "u",
      user_data: {
        known: false,
        studied: true,
      },
    },
  ],
};

describe("cacheUpdaters", () => {
  it("can update known on an item", () => {
    const updated = withUpdatedKnownStudied({
      fullObject: dataItem,
      pathToKnownStudied: ["searchResults", 0, "user_data"],
      knownOrStudied: "known",
      newValue: false,
    });

    expect(updated).toEqual(expectedAfterUpdateKnown);
  });
});
