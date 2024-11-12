import { useState } from "react";
import { getCookie, setCookie } from "../web-utils/cookies";

export type UseFontSizeSettingsReturns = {
  realFontSize: number;
  relativeFontSize: number;
  updateRelativeFontSize: (newSize: number) => void;
};

export const useFontSizeSettings = (): UseFontSizeSettingsReturns => {
  const getFontSize = (): number => {
    const cookie = getCookie("relative-font-size");
    return cookie ? Number(cookie) : 1.0;
  };

  const updateRelativeFontSize = (percent: number) => {
    /* from 0.5 to 2.0 */
    setRelativeFontSize(percent);
    setCookie("relative-font-size", String(percent));
  };

  const [relativeFontSize, setRelativeFontSize] =
    useState<number>(getFontSize()); /* 100% of default */

  const getRealFontSize = (): number => {
    /* the size as decided by the media queries */
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
