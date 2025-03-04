import { SettingNameAndControls } from "./SettingNameAndControls";
import { SimpleCheckboxControl } from "./SimpleCheckboxControl";

export const SendUnimportantNotificationsSettingsArea = ({
  sendUnimportantNotificationSettings,
}: {
  sendUnimportantNotificationSettings: {
    demoDoSend: boolean;
    setDemoDoSend: (newValue: boolean) => void;
  };
}) => {
  return (
    <SettingNameAndControls
      settingName="모든 알람 받기"
      settingHelp="불필요하거나 꼭 아셔야 되지 않을 안내도 전송합니다."
      controls={
        <SimpleCheckboxControl
          value={sendUnimportantNotificationSettings.demoDoSend}
          setter={sendUnimportantNotificationSettings.setDemoDoSend}
        />
      }
    />
  );
};
