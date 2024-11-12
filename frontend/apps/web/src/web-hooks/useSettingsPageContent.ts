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

  const save = () => {
    fontSizeSettings.updateRelativeFontSize(2 ** demoFontSize);
  };

  return {
    currentSettings,
    save,
  };
};
