import { ReactNode, useContext, createContext } from "react";
import { useKeyboardConversionSettings } from "./useKeyboardConversionSettings";
import { useFontSizeSettings } from "./useFontSizeSettings";

export type FontSizeSettingsType = {
  relativeFontSize: number;
  updateRelativeFontSize: (newSize: number) => boolean;
};

export type KeyboardConversionSettingsType = {
  doConversion: boolean;
  updateDoConversion: (newValue: boolean) => boolean;
};

export interface SettingsType {
  fontSizeSettings: FontSizeSettingsType;
  keyboardConversionSettings: KeyboardConversionSettingsType;
}

export const SettingsContext = createContext<SettingsType | undefined>(
  undefined
);

export interface SettingsContextProviderArgs {
  children: ReactNode;
}

export const SettingsContextProvider = ({
  children,
}: SettingsContextProviderArgs) => {
  const { realFontSize, relativeFontSize, updateRelativeFontSize } =
    useFontSizeSettings();
  const { doConversion, updateDoConversion } = useKeyboardConversionSettings();

  return (
    <SettingsContext.Provider
      value={{
        fontSizeSettings: {
          relativeFontSize,
          updateRelativeFontSize,
        },
        keyboardConversionSettings: {
          doConversion,
          updateDoConversion,
        },
      }}
    >
      <div
        className="h-full w-full"
        style={{
          fontSize: `${realFontSize}em`,
        }}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a context provider"
    );
  }
  return context;
};
