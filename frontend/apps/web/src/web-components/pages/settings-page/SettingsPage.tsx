import { ReactNode, useState } from "react";
import { SearchIcon } from "lucide-react";
import "./keyboard-conversion.css";
import { PageWithNavBar } from "../navbar/PageWithNavBar";
import { useSettingsPageContent } from "./useSettingsPageContent";

export const SettingsPage = () => {
  return (
    <PageWithNavBar>
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-[90%] w-[80%] p-6">
          <SettingsPageContent />
        </div>
      </div>
    </PageWithNavBar>
  );
};

const SettingsPageContent = () => {
  const { currentSettings, save } = useSettingsPageContent();

  return (
    <div className="overflow-y-scroll h-full w-full border-[color:--border-color] rounded-xl bg-[color:--background-secondary]">
      <div
        style={{
          fontSize: "200%",
        }}
        className="text-center bg-[color:--accent-4] rounded-md py-1"
      >
        설정
      </div>
      <div className="w-full flex flex-1 flex-col items-center py-6 space-y-6 gap-10">
        <FontSizeSettingArea fontSizeSettings={currentSettings.fontSize} />
        <KeyboardConversionSettingArea
          keyboardConversionSettings={currentSettings.keyboardConversion}
        />
        <SaveButtonAndMessage save={save} />
      </div>
    </div>
  );
};

const SaveButtonAndMessage = ({ save }: { save: () => boolean }) => {
  const [saveSuccessful, setSaveSuccessful] = useState<undefined | boolean>(
    undefined
  );

  /* done to force visual update */
  const updateSaveSuccessful = (newValue: boolean) => {
    setSaveSuccessful(undefined);
    setTimeout(() => {
      setSaveSuccessful(newValue);
    }, 300);
  };

  return (
    <>
      <button onClick={() => updateSaveSuccessful(save())}>저장</button>
      {saveSuccessful !== undefined && (
        <SaveMessage saveSuccessful={saveSuccessful} />
      )}
    </>
  );
};

const SaveMessage = ({ saveSuccessful }: { saveSuccessful: boolean }) => {
  return (
    <div>
      {saveSuccessful ? (
        <span className="text-[color:--success-color]">저장 성공</span>
      ) : (
        <span className="text-[color:--error-color]">
          저장하려다가 오류가 발생했습니다. 브라우저 설정 또는 프라이빗 모드가
          원인일 수 있습니다.
        </span>
      )}
    </div>
  );
};

const SettingNameAndControls = ({
  settingName,
  settingHelp,
  controls,
}: {
  settingName: string;
  settingHelp: string;
  controls: ReactNode;
}) => {
  return (
    <div className="flex flex-row w-[70%] gap-24">
      <div className="w-[30%] text-right cursor-help" title={settingHelp}>
        {settingName}
      </div>
      <div className="w-[70%] text-left">{controls}</div>
    </div>
  );
};

const FontSizeSettingArea = ({
  fontSizeSettings,
}: {
  fontSizeSettings: {
    relativeFontSize: number;
    demoFontSize: number;
    setDemoFontSize: (newSize: number) => void;
  };
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fontSizeSettings.setDemoFontSize(Number(e.target.value));
  };

  const getSampleSize = () => {
    /* has the relative size scalar applied */
    const before = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-size")
      .replace("em", "");

    /* getting default */
    const defaultSize = Number(before) / fontSizeSettings.relativeFontSize;

    /* reapplying new scalar for demo */
    const ret = defaultSize * 2 ** fontSizeSettings.demoFontSize;

    return isNaN(ret) ? 1 : ret;
  };

  const controlArea = (
    <div>
      <input
        type="range"
        className="w-full"
        min="-1"
        max="1"
        step="0.1"
        value={fontSizeSettings.demoFontSize}
        onChange={handleChange}
        list="labels"
      />
      <datalist id="labels">
        <option value="-1" label="0.5x" />
        <option value="0" label="1x" />
        <option value="1" label="2x" />
      </datalist>
      <div className="w-full flex justify-between">
        <div className="w-4 text-center">0.5x</div>
        <div className="w-4 text-center">1x</div>
        <div className="w-4 text-center">2x</div>
      </div>

      {/* shows size */}
      <div className="min-h-6">
        <div
          className="h-full w-full text-center"
          style={{ fontSize: `${getSampleSize()}em` }}
        >
          글꼴 크기를 변경해보세요!
        </div>
      </div>
    </div>
  );

  return (
    <SettingNameAndControls
      settingName="글꼴 크기"
      settingHelp="글꼴의 크기를 변경한다."
      controls={controlArea}
    />
  );
};

const KeyboardConversionSettingArea = ({
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
      <div className="w-[40%] flex justify-center items-center">
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
      <div className="w-[60%] flex justify-center items-center">
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
      outline-none text-[color:--text-primary]
      "
      >
        <span className="animate-typing-in-word"></span>
      </div>
    </div>
  );
};
