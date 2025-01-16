import { PageWithNavBar } from "../navbar/PageWithNavBar";
import { SettingsPageContent } from "./SettingsPageContent";

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
