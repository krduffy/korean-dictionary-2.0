import { ReactNode } from "react";
import { PageWithNavBar } from "../web-components/navbar/PageWithNavBar";

import { useSettingsPageContent } from "../web-hooks/useSettingsPageContent";

export const SettingsPage = () => {
  return (
    <PageWithNavBar>
      <div className="h-[90%] w-[80%] p-6 flex flex-row items-center">
        <SettingsPageContent />
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
      <div className="w-full flex flex-1 flex-col items-center py-6 space-y-6">
        <FontSizeSettingArea fontSizeSettings={currentSettings.fontSize} />
        <button onClick={() => save()}>저장</button>
      </div>
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
    <div className="flex flex-row">
      <div className="w-[20%] text-center cursor-help" title={settingHelp}>
        {settingName}
      </div>
      <div className="w-[80%]">{controls}</div>
    </div>
  );
};

const FontSizeSettingArea = ({
  fontSizeSettings,
}: {
  fontSizeSettings: {
    demoFontSize: number;
    setDemoFontSize: (newSize: number) => void;
  };
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fontSizeSettings.setDemoFontSize(Number(e.target.value));
  };

  const controlArea = (
    <div className="w-64">
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
    </div>
  );

  return (
    <SettingNameAndControls
      settingName="글꼴 크기"
      settingHelp="글꼴의 크기를 변경합니다."
      controls={controlArea}
    />
  );
};
