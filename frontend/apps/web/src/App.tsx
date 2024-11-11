import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DictionaryPage from "./web-components/dictionary-page/DictionaryPage";
import { LoginPage } from "./web-routes/LoginPage";
import { PersistentDictionaryPageStateContextProvider } from "./web-contexts/PersistentDictionaryPageStateContext";
import { CachingContextProvider } from "@repo/shared/contexts/CachingContextProvider";

export const App = () => {
  return (
    <CachingContextProvider cacheCapacity={5}>
      <PersistentDictionaryPageStateContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DictionaryPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </PersistentDictionaryPageStateContextProvider>
    </CachingContextProvider>
  );
};
