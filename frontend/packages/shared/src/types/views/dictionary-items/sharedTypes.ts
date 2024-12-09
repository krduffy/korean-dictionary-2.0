import { isBoolean, isObject } from "../../guardUtils";

export type UserDataType = {
  is_known: boolean;
  is_studied: boolean;
};

/* Guards */

export function isUserData(value: unknown): value is UserDataType {
  return (
    isObject(value) && isBoolean(value.is_known) && isBoolean(value.is_studied)
  );
}
