import { SearchIcon } from "lucide-react";
import "./keyboard-conversion.css";
import { SettingNameAndControls } from "./SettingNameAndControls";

export const KeyboardConversionSettingArea = ({
  keyboardConversionSettings,
}: {
  keyboardConversionSettings: {
    demoDoConversion: boolean;
    setDemoDoConversion: (newValue: boolean) => void;
  };
}) => {
  return (
    <SettingNameAndControls
      settingName="검색 시 검색어 영문 → 한글 자동 전환"
      settingHelp="검색 시 입력어가 영문이 있는 경우 한글 키보드 위주로 전환된다."
      controls={
        <KeyboardConversionSettingAreaControls
          keyboardConversionSettings={keyboardConversionSettings}
        />
      }
    />
  );
};

const KeyboardConversionSettingAreaControls = ({
  keyboardConversionSettings,
}: {
  keyboardConversionSettings: {
    demoDoConversion: boolean;
    setDemoDoConversion: (newValue: boolean) => void;
  };
}) => {
  return (
    <div className="flex flex-row h-10">
      <div className="min-w-8 flex-none flex justify-center items-center">
        <input
          type="checkbox"
          className=""
          checked={keyboardConversionSettings.demoDoConversion}
          onChange={() =>
            keyboardConversionSettings.setDemoDoConversion(
              !keyboardConversionSettings.demoDoConversion
            )
          }
        ></input>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <DemoSearchBar />
      </div>
    </div>
  );
};

const DemoSearchBar = () => {
  /** Fake search bar with animation on the search bar content to demonstrate how
   *  keyboard conversion works
   */
  return (
    <div className="relative h-full w-full">
      <SearchIcon className="h-full absolute top-0 left-0 pl-2" />
      <div
        className="h-full w-full pl-10 px-4 py-2 
                   bg-[color:--neutral-color-not-hovering]
                   border
                   rounded-full
                   ring-2 border-[color:--focus-blue]
                   outline-none text-[color:--text-primary]"
      >
        <span className="animate-typing-in-word"></span>
      </div>
    </div>
  );
};
