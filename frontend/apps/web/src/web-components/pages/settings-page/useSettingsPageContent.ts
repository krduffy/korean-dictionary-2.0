import { useState } from "react";
import { useSettingsContext } from "../../../web-contexts/SettingsContext";

export const useSettingsPageContent = () => {
  const { fontSizeSettings, keyboardConversionSettings } = useSettingsContext();

  const initialDemoFontSize =
    Math.log(fontSizeSettings.relativeFontSize) / Math.log(2);

  const [demoFontSize, setDemoFontSize] = useState<number>(initialDemoFontSize);
  const [demoDoConversion, setDemoDoConversion] = useState<boolean>(
    keyboardConversionSettings.doConversion
  );

  const currentSettings = {
    fontSize: {
      relativeFontSize: fontSizeSettings.relativeFontSize,
      demoFontSize: demoFontSize,
      setDemoFontSize: setDemoFontSize,
    },
    keyboardConversion: {
      demoDoConversion: demoDoConversion,
      setDemoDoConversion: setDemoDoConversion,
    },
  };

  /** Saves the current settings and returns whether or not the operation was successful. */
  const save = (): boolean => {
    const first = fontSizeSettings.updateRelativeFontSize(2 ** demoFontSize);
    const second =
      keyboardConversionSettings.updateDoConversion(demoDoConversion);

    return first && second;
  };

  return {
    currentSettings,
    save,
  };
};
