import { useState } from "react";
import { useSettingsPageContent } from "./useSettingsPageContent";
import { TitledPageContent } from "../TitledPageContent";
import { Button } from "../../ui/Button";
import { FontSizeSettingArea } from "./FontSizeSettingArea";
import { KeyboardConversionSettingArea } from "./KeyboardConversionSettingArea";

export const SettingsPageContent = () => {
  const { currentSettings, save } = useSettingsPageContent();

  return (
    <TitledPageContent title="설정">
      <div className="w-full flex flex-1 flex-col items-center py-6 space-y-6 gap-10">
        <SaveButtonAndMessage save={save} />
        <FontSizeSettingArea fontSizeSettings={currentSettings.fontSize} />
        <KeyboardConversionSettingArea
          keyboardConversionSettings={currentSettings.keyboardConversion}
        />
      </div>
    </TitledPageContent>
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
    <div className="flex flex-row items-center gap-8">
      <div className="w-[30%] flex justify-center items-center">
        <Button onClick={() => updateSaveSuccessful(save())}>저장</Button>
      </div>
      <div className="flex-1">
        <SaveMessage saveSuccessful={saveSuccessful} />
      </div>
    </div>
  );
};

const SaveMessage = ({
  saveSuccessful,
}: {
  saveSuccessful: boolean | undefined;
}) => {
  if (saveSuccessful === undefined)
    return <span>설정을 변경하시면 저장버튼을 누르십시오.</span>;

  if (saveSuccessful)
    return <span className="text-[color:--success-color]">저장 성공</span>;

  return (
    <span className="text-[color:--error-color]">
      저장하려다가 오류가 발생했습니다. 브라우저 설정 또는 프라이빗 모드가
      원인일 수 있습니다.
    </span>
  );
};
