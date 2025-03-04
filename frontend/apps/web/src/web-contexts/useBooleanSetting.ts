import { useState } from "react";

type BooleanSettingReturn = {
  value: boolean;
  setter: (newValue: boolean) => boolean;
};

export const useBooleanSetting = ({
  nameOfSetting,
}: {
  nameOfSetting: string;
}): BooleanSettingReturn => {
  const getValue = (): boolean => {
    try {
      const fromStorage = localStorage.getItem(nameOfSetting);
      if (fromStorage === "true") return true;
      if (fromStorage === "false") return false;
      return false;
    } catch (e) {
      /* Security error */
      console.warn(
        `Cannot access localStorage; returning false (no value \`${nameOfSetting}\`).`
      );
      return false;
    }
  };

  const [value, setValue] = useState<boolean>(getValue());

  /** Updates whether the conversion should be done on search; returns if the operation
   *  was successful.
   */
  const updateValue = (newValue: boolean): boolean => {
    try {
      localStorage.setItem(nameOfSetting, String(newValue));
      setValue(newValue);
      return true;
    } catch {
      return false;
    }
  };

  return {
    value,
    setter: updateValue,
  };
};
