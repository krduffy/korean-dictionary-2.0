import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DictionaryPage from "./web-routes/DictionaryPage";
import { LoginPage } from "./web-routes/LoginPage";
import { CachingContextProvider } from "@repo/shared/contexts/CachingContextProvider";
import { SettingsPage } from "./web-routes/SettingsPage";
import { SettingsContextProvider } from "./web-contexts/SettingsContext";
import { Notifications } from "./web-components/page/Notifications";
import { NotificationContextProvider } from "@repo/shared/contexts/NotificationContextProvider";
import { PersistentDictionaryPageStateContextProvider } from "@repo/shared/contexts/PersistentDictionaryPageStateContext";
import { GlobalFunctionsContextProvider } from "@repo/shared/contexts/GlobalFunctionsContextProvider";

export const App = () => {
  return (
    <SettingsContextProvider>
      <GlobalFunctionsContextProvider>
        <CachingContextProvider cacheCapacity={16}>
          <PersistentDictionaryPageStateContextProvider>
            <NotificationContextProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<DictionaryPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Router>
              <Notifications />
            </NotificationContextProvider>
          </PersistentDictionaryPageStateContextProvider>
        </CachingContextProvider>
      </GlobalFunctionsContextProvider>
    </SettingsContextProvider>
  );
};
