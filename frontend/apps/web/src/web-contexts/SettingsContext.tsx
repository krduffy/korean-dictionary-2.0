import { ReactNode, useContext, createContext } from "react";
import { useBooleanSetting } from "./useBooleanSetting";
import { useFontSizeSettings } from "./useFontSizeSettings";

export type FontSizeSettingsType = {
  relativeFontSize: number;
  updateRelativeFontSize: (newSize: number) => boolean;
};

export type KeyboardConversionSettingsType = {
  doConversion: boolean;
  updateDoConversion: (newValue: boolean) => boolean;
};

export type SendUnimportantNotificationsSettingType = {
  doSend: boolean;
  updateDoSend: (newValue: boolean) => boolean;
};

export type IncludeUnknownWordsInDerivedTextPageViewSettingsType = {
  doInclude: boolean;
  updateDoInclude: (newValue: boolean) => boolean;
};

export interface SettingsType {
  fontSizeSettings: FontSizeSettingsType;
  keyboardConversionSettings: KeyboardConversionSettingsType;
  sendUnimportantNotificationsSettings: SendUnimportantNotificationsSettingType;
  includeUnknownWordsInDerivedTextPageViewSettings: IncludeUnknownWordsInDerivedTextPageViewSettingsType;
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
  const { value: doConversion, setter: updateDoConversion } = useBooleanSetting(
    { nameOfSetting: "preferred-do-keyboard-conversion-on-search" }
  );
  const { value: doSend, setter: updateDoSend } = useBooleanSetting({
    nameOfSetting: "preferred-send-unimportant-notifications",
  });
  const { value: doInclude, setter: updateDoInclude } = useBooleanSetting({
    nameOfSetting: "preferred-include-unknown-words-in-derived-text-view",
  });

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
        sendUnimportantNotificationsSettings: {
          doSend,
          updateDoSend,
        },
        includeUnknownWordsInDerivedTextPageViewSettings: {
          doInclude,
          updateDoInclude,
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
