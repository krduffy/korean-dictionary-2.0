import { ReactNode, useLayoutEffect, useRef } from "react";
import { KoreanSearchView } from "../views/KoreanSearchView";
import { HanjaSearchView } from "../views/HanjaSearchView";
import { KoreanDetailView } from "../views/KoreanDetailView";
import { HanjaDetailView } from "../views/HanjaDetailView";
import { FindLemmaView } from "../views/FindLemmaView";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { View } from "@repo/shared/types/views/viewTypes";

/* a wrapper around MainContent to add the updating of scroll distance functionality */
export const MainContentArea = ({
  children,
  scrollDistance,
  historyPointer,
}: {
  children: ReactNode;
  scrollDistance: number;
  historyPointer: number;
}) => {
  const { dispatch } = useViewDispatchersContext();
  const divRef = useRef<HTMLDivElement>(null);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (uiHandler) => {
    const newScrollDistance = uiHandler.currentTarget.scrollTop;
    dispatch({
      type: "update_scroll_distance",
      scrollDistance: newScrollDistance,
    });
  };

  const restoreScroll = () => {
    if (!divRef.current) {
      return;
    }

    divRef.current.scroll({
      top: scrollDistance,
      behavior: "instant",
    });
  };

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => restoreScroll());
    if (divRef.current) {
      observer.observe(divRef.current);
    }
    return () => observer.disconnect();
  }, [historyPointer]);

  return (
    <div
      ref={divRef}
      style={{
        maxHeight: "100%",
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export const MainContent = ({ view }: { view: View }) => {
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
        dropdownStates={view.interactionData.dropdowns}
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
