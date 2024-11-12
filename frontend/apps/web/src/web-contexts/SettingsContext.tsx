import { ReactNode, useContext, createContext } from "react";
import {
  UseFontSizeSettingsReturns,
  useFontSizeSettings,
} from "../web-hooks/useFontSizeSettings";

export type FontSizeSettingsType = {
  relativeFontSize: number;
  updateRelativeFontSize: (newSIze: number) => void;
};

export interface SettingsType {
  fontSizeSettings: FontSizeSettingsType;
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

  return (
    <SettingsContext.Provider
      value={{
        fontSizeSettings: {
          relativeFontSize,
          updateRelativeFontSize,
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
