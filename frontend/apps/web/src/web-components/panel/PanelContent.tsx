import { useRef } from "react";
import { KoreanSearchView } from "../dictionary-items/api-fetchers/KoreanSearchView";
import { HanjaSearchView } from "../dictionary-items/api-fetchers/HanjaSearchView";
import { KoreanDetailView } from "../dictionary-items/api-fetchers/KoreanDetailView";
import { HanjaDetailView } from "../dictionary-items/api-fetchers/HanjaDetailView";
import { FindLemmaView } from "../dictionary-items/api-fetchers/FindLemmaView";
import { View } from "@repo/shared/types/views/viewTypes";
import { useScrollSaveAndRestoration } from "./useRestoreScroll";
import { LineBreakArea } from "../ui/LineBreakArea";

/* a wrapper around PanelContent to add the updating of scroll distance functionality */
export const PanelContent = ({
  view,
  scrollDistance,
  historyPointer,
}: {
  view: View;
  scrollDistance: number;
  historyPointer: number;
}) => {
  const mainContentRef = useRef<HTMLDivElement>(null);

  const { onScroll } = useScrollSaveAndRestoration({
    mainContentRef,
    scrollDistance,
    historyPointer,
  });

  return (
    <div
      ref={mainContentRef}
      className="flex flex-1 flex-col overflow-y-scroll overflow-x-hidden"
      style={{
        scrollbarWidth: "thin",
      }}
      onScroll={onScroll}
    >
      <ViewContent view={view} />
      <LineBreakArea marginSize={20} />
    </div>
  );
};

const ViewContent = ({ view }: { view: View }) => {
  if (view.type === "korean_search") {
    return <KoreanSearchView searchConfig={view.data} />;
  }

  if (view.type === "hanja_search") {
    return <HanjaSearchView searchConfig={view.data} />;
  }

  if (view.type === "korean_detail") {
    return (
      <KoreanDetailView
        target_code={view.data.target_code}
        interactionData={view.interactionData}
      />
    );
  }

  if (view.type === "hanja_detail") {
    return (
      <HanjaDetailView
        character={view.data.character}
        interactionData={view.interactionData}
      />
    );
  }

  if (view.type === "find_lemma") {
    return (
      <FindLemmaView word={view.data.word} sentence={view.data.sentence} />
    );
  }

  return <div>Unknown view.</div>;
};
