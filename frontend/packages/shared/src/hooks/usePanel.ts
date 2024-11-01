import {
  SearchConfig,
  UsePanelReturns,
  View,
} from "../types/panelAndViewTypes";
import { useSearchSubmitter } from "../hooks/useSearchSubmitter";
import { useSearchConfigSetters } from "../hooks/useSearchConfigSetters";
import { useState } from "react";

export const usePanel = ({
  view,
  setView,
}: {
  view: View;
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
