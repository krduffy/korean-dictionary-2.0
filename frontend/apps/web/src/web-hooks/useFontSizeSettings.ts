import { useState } from "react";

export type UseFontSizeSettingsReturns = {
  /** The base size of text on the page, measured in `em`s. */
  realFontSize: number;
  /** The size of the text on the page, relative to the default size. Between 0.5 and 2.0. */
  relativeFontSize: number;
  /** Updates preferred relative font size in localStorage and returns whether or not the
   * operation was successful. */
  updateRelativeFontSize: (newSize: number) => boolean;
};

export const useFontSizeSettings = (): UseFontSizeSettingsReturns => {
  /** Gets and returns the user's preferred (relative) font size from localStorage.
   *  If the size is not in localStorage or an error occurs during retrieval,
   *  default value 1.0 is returned.
   */
  const getFontSize = (): number => {
    try {
      const fromStorage = localStorage.getItem("preferred-relative-font-size");
      return fromStorage ? Number(fromStorage) : 1.0;
    } catch (e) {
      /* Security error */
      console.warn("Cannot access localStorage; returning default font size.");
      return 1.0;
    }
  };

  /** Updates preferred relative font size in localStorage and returns whether or not the
   * operation was successful. */
  const updateRelativeFontSize = (percent: number) => {
    /* from 0.5 to 2.0 */
    setRelativeFontSize(percent);

    try {
      localStorage.setItem("preferred-relative-font-size", String(percent));
      return true;
    } catch (e) {
      return false;
    }
  };

  const [relativeFontSize, setRelativeFontSize] =
    useState<number>(getFontSize()); /* 100% of default */

  /** Returns the size of text on the page, measured in `em`s. */
  const getRealFontSize = (): number => {
    const before = getComputedStyle(document.documentElement).getPropertyValue(
      "--font-size"
    );
    return parseFloat(before) * relativeFontSize;
  };

  return {
    realFontSize: getRealFontSize(),
    relativeFontSize,
    updateRelativeFontSize,
  };
};
