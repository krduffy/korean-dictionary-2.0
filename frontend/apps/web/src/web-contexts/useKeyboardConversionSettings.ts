import { useState } from "react";

export type UseKeyboardConversionSettingsReturns = {
  doConversion: boolean;
  updateDoConversion: (newValue: boolean) => boolean;
};

export const useKeyboardConversionSettings =
  (): UseKeyboardConversionSettingsReturns => {
    const getDoConversion = (): boolean => {
      try {
        const fromStorage = localStorage.getItem(
          "preferred-do-keyboard-conversion-on-search"
        );
        if (fromStorage === "true") return true;
        if (fromStorage === "false") return false;
        return false;
      } catch (e) {
        /* Security error */
        console.warn(
          "Cannot access localStorage; returning false (no keyboard conversion)."
        );
        return false;
      }
    };

    const [doConversion, setDoConversion] =
      useState<boolean>(getDoConversion());

    /** Updates whether the conversion should be done on search; returns if the operation
     *  was successful.
     */
    const updateDoConversion = (newValue: boolean): boolean => {
      try {
        localStorage.setItem(
          "preferred-do-keyboard-conversion-on-search",
          String(newValue)
        );
        setDoConversion(newValue);
        return true;
      } catch {
        return false;
      }
    };

    return {
      doConversion: doConversion,
      updateDoConversion,
    };
  };
