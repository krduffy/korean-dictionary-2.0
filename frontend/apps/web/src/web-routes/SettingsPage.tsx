import { PageWithNavBar } from "../web-components/navbar/PageWithNavBar";

export const SettingsPage = () => {
  return (
    <PageWithNavBar>
      <SettingsPageContent />
    </PageWithNavBar>
  );
};

const SettingsPageContent = () => {
  return <div>설정</div>;
};
