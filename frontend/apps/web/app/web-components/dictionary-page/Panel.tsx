"use client";
import { useState, useContext, useEffect } from "react";
import { usePanel } from "@repo/shared/hooks/usePanel";
import { useMainContent } from "@repo/shared/hooks/useMainContent";
import { KoreanSearchView } from "./KoreanSearchView";
import { SearchBarArea } from "./SearchBarArea";
import { PanelSelfContext } from "../../web-contexts/PanelContext";

import { View } from "@repo/shared/types/panelAndViewTypes";

interface PanelArgs {
  initialView: View;
  onClose: () => void;
}

export const Panel = ({ initialView, onClose }: PanelArgs) => {
  const [view, setView] = useState(initialView);
  const { updateSelfInMemory } = useContext(PanelSelfContext);

  const { searchConfigSetters, submitSearch } = usePanel({
    view: view,
    setView: setView,
  });

  useEffect(() => {
    updateSelfInMemory(<Panel initialView={view} onClose={onClose} />);
  }, [JSON.stringify(view)]);

  return (
    <div>
      <CloseButton onClose={onClose} />
      <SearchBarArea
        searchConfig={view.searchConfig}
        searchConfigSetters={searchConfigSetters}
        submitSearch={submitSearch}
      />
      <MainContent view={view} />
    </div>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return <button onClick={onClose}>to close</button>;
};

const MainContent = ({ view }: { view: View }) => {
  useMainContent({ view: view });

  if (view.type === "korean_search") {
    return <KoreanSearchView searchTerm={view.data.searchTerm} />;
  }

  return <div>Unknown view.</div>;
};
