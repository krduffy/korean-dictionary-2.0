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
    <div
      className="h-full bg-[color:--background-secondary] text-[color:--text-secondary] p-4 
    rounded-2xl
    shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20
    backdrop-blur-[12px]
    hover:shadow-[0_8px_35px_rgb(0,0,0,0.16)]
    transition-shadow duration-300
    saturate-[1.02]
"
    >
      <div>
        <SearchBarArea
          searchConfig={view.searchConfig}
          searchConfigSetters={searchConfigSetters}
          submitSearch={submitSearch}
        />
        <CloseButton onClose={onClose} />
      </div>
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
    return <KoreanSearchView data={view.data} />;
  }

  return <div>Unknown view.</div>;
};
