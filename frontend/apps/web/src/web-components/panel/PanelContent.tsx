import { memo, useEffect, useRef } from "react";
import { KoreanSearchView } from "../dictionary-items/api-fetchers/KoreanSearchView";
import { HanjaSearchView } from "../dictionary-items/api-fetchers/HanjaSearchView";
import { KoreanDetailView } from "../dictionary-items/api-fetchers/KoreanDetailView";
import { HanjaDetailView } from "../dictionary-items/api-fetchers/HanjaDetailView";
import { FindLemmaView } from "../dictionary-items/api-fetchers/FindLemmaView";
import { View } from "@repo/shared/types/views/viewTypes";
import { useScrollSaveAndRestoration } from "./useRestoreScroll";
import { LineBreakArea } from "../ui/LineBreakArea";
import { PanelHomepage } from "./PanelHomepage";
import { DerivedExampleTextDetailView } from "../dictionary-items/api-fetchers/DerivedExampleTextDetailView";
import { DerivedExampleTextEojeolNumLemmasView } from "../dictionary-items/api-fetchers/DerivedExampleTextEojeolNumLemmasView";
import { UserExamplesPageView } from "../dictionary-items/api-fetchers/user-examples/UserExamplesPageView";
/* a wrapper around PanelContent to add the updating of scroll distance 
   functionality */
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
      className="p-2 flex flex-col overflow-y-auto overflow-x-hidden"
      style={{
        scrollbarWidth: "thin",
      }}
      onScroll={onScroll}
    >
      <ViewContent view={view} />
      <LineBreakArea marginSize={80} />
    </div>
  );
};

const ViewContent = memo(({ view }: { view: View }) => {
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
      <FindLemmaView
        word={view.data.word}
        sentence={view.data.sentence}
        index={view.data.index}
      />
    );
  }

  if (view.type === "panel_homepage") {
    return <PanelHomepage interactionData={view.interactionData} />;
  }

  if (view.type === "lemma_derived_text_detail") {
    return (
      <DerivedExampleTextDetailView
        sourceTextPk={view.data.source_text_pk}
        interactionData={view.interactionData}
      />
    );
  }

  if (view.type === "lemma_derived_text_eojeol_num_lemmas") {
    return <DerivedExampleTextEojeolNumLemmasView data={view.data} />;
  }

  if (view.type === "korean_user_example_edit_view") {
    return <UserExamplesPageView headwordTargetCode={view.data.target_code} />;
  }

  return <div>Unknown view.</div>;
});
