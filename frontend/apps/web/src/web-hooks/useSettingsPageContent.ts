import { useState } from "react";
import { useSettingsContext } from "../web-contexts/SettingsContext";

export const useSettingsPageContent = () => {
  const { fontSizeSettings } = useSettingsContext();

  const initialDemoFontSize =
    Math.log(fontSizeSettings.relativeFontSize) / Math.log(2);

  const [demoFontSize, setDemoFontSize] = useState<number>(initialDemoFontSize);

  const currentSettings = {
    fontSize: {
      demoFontSize: demoFontSize,
      setDemoFontSize: setDemoFontSize,
    },
  };

  /** Saves the current settings and returns whether or not the operation was successful. */
  const save = (): boolean => {
    const successful = fontSizeSettings.updateRelativeFontSize(
      2 ** demoFontSize
    );

    return successful;
  };

  return {
    currentSettings,
    save,
  };
};
