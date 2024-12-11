import {
  APIResponseType,
  JsonArrayType,
  JsonDataType,
  JsonObjectType,
} from "../../types/apiCallTypes";

export const withUpdatedKnownStudied = ({
  fullResponse,
  pathToKnownStudied,
  knownOrStudied,
  newValue,
}: {
  fullResponse: APIResponseType;
  pathToKnownStudied: (string | number)[];
  knownOrStudied: "known" | "studied";
  newValue: boolean;
}): APIResponseType => {
  try {
    const newFullObject = { ...fullResponse };

    /* ref is reference to somewhere in the fullResponse supplied. */
    let ref: JsonObjectType | JsonArrayType = newFullObject;

    for (const index of pathToKnownStudied) {
      let indexed: JsonDataType | undefined;

      /* IF ARRAY */
      if (Array.isArray(ref)) {
        if (typeof index !== "number") {
          throw new Error(`A nonnumber is being used to index an array in withUpdatedKnownStudied.
        object: ${ref.toString()}; index/key: ${index}`);
        }

        indexed = ref[index];
      } else if (typeof ref === "object") {
        /* ELSE IF STILL OBJECT */
        indexed = ref[index];
      }

      if (indexed === undefined) {
        throw new Error(`An absent key or index was supplied to withUpdatedKnownStudied.
        object: ${ref.toString()}; index/key: ${index}`);
      } else if (typeof indexed !== "object" || indexed === null) {
        throw new Error(`Unexpectedly indexed into a non-array and non-object (or null) data item
        in withUpdatedKnownStudied. object: ${ref}; index/key: ${index}`);
      }

      ref = indexed;
    }

    if (typeof ref !== "object" || Array.isArray(ref) || ref === null) {
      throw new Error(
        `Path supplied did not lead to a valid object in withUpdatedKnownStudied;
      path: ${pathToKnownStudied}, led to: ${ref}`
      );
    }

    ref[knownOrStudied] = newValue;

    return newFullObject;
  } catch {
    return fullResponse;
  }
};
