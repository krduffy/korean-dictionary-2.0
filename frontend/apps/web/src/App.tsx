import { CachingContextProvider } from "@repo/shared/contexts/CachingContextProvider";
import { SettingsContextProvider } from "./web-contexts/SettingsContext";
import { NotificationContextProvider } from "@repo/shared/contexts/NotificationContextProvider";
import { PersistentDictionaryPageStateContextProvider } from "@repo/shared/contexts/PersistentDictionaryPageStateContext";
import { GlobalFunctionsContextProvider } from "@repo/shared/contexts/GlobalFunctionsContextProvider";
import { Page } from "./web-components/pages/Page";

export const App = () => {
  return (
    <SettingsContextProvider>
      <GlobalFunctionsContextProvider>
        <CachingContextProvider cacheCapacity={16}>
          <PersistentDictionaryPageStateContextProvider>
            <NotificationContextProvider>
              <Page />
            </NotificationContextProvider>
          </PersistentDictionaryPageStateContextProvider>
        </CachingContextProvider>
      </GlobalFunctionsContextProvider>
    </SettingsContextProvider>
  );
};
