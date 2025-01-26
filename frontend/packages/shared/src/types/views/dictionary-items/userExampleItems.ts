import { isObject, isString, isTypeOrNull } from "../../guardUtils";

export type DerivedExampleTextType = {
  text: string;
  source: string;
  image_url?: string;
};

/* Guards */

export function isDerivedExampleTextType(
  value: unknown
): value is DerivedExampleTextType {
  return (
    isObject(value) &&
    isString(value.text) &&
    isString(value.source) &&
    isTypeOrNull(value.image_url, isString)
  );
}
