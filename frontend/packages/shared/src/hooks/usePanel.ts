import {
  SearchConfig,
  UsePanelReturns,
  View,
} from "../types/panelAndViewTypes";
import { useSearchSubmitter } from "./searching-hooks/useSearchSubmitter";
import { useSearchConfigSetters } from "./searching-hooks/useSearchConfigSetters";

export const usePanel = ({
  view,
  setView,
}: {
  view: View;
  // eslint-disable-next-line no-unused-vars
  setView: (view: View) => void;
}): UsePanelReturns => {
  const setSearchConfig = (newSearchConfig: SearchConfig) => {
    const newView = {
      ...view,
      searchConfig: newSearchConfig,
    } as const;

    setView(newView);
  };

  const { submitSearch } = useSearchSubmitter({
    setView: setView,
    searchConfig: view.searchConfig,
  });

  const { searchConfigSetters } = useSearchConfigSetters({
    searchConfig: view.searchConfig,
    setSearchConfig: setSearchConfig,
  });

  return {
    searchConfigSetters,
    submitSearch,
  };
};
