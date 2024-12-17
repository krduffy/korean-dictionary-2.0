import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DictionaryPage from "./dictionary-page/DictionaryPage";
import { LoginPage } from "./login-page/LoginPage";
import { SettingsPage } from "./settings-page/SettingsPage";
import { Notifications } from "./notifications/Notifications";

export const Page = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DictionaryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
      <Notifications />
    </>
  );
};
