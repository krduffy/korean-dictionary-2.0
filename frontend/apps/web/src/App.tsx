import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DictionaryPage from "./web-routes/DictionaryPage";
import { LoginPage } from "./web-routes/LoginPage";
import { PersistentDictionaryPageStateContextProvider } from "./web-contexts/PersistentDictionaryPageStateContext";
import { CachingContextProvider } from "@repo/shared/contexts/CachingContextProvider";
import { SettingsPage } from "./web-routes/SettingsPage";
import { SettingsContextProvider } from "./web-contexts/SettingsContext";
import { NotificationContextProvider } from "./web-contexts/NotificationContextProvider";
import { Notifications } from "./web-components/page/Notifications";
import { APIDataChangeManagerContextProvider } from "@repo/shared/contexts/APIDataChangeManagerContextProvider";

export const App = () => {
  return (
    <SettingsContextProvider>
      <APIDataChangeManagerContextProvider>
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
      </APIDataChangeManagerContextProvider>
    </SettingsContextProvider>
  );
};
