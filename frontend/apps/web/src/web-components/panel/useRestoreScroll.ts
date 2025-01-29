import { useLayoutEffect } from "react";
import { useDebouncedScrollUpdate } from "./useDebouncedScrollUpdate";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const useScrollSaveAndRestoration = ({
  mainContentRef,
  scrollDistance,
  historyPointer,
}: {
  mainContentRef: React.MutableRefObject<HTMLElement | null>;
  scrollDistance: number;
  historyPointer: number;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const { onScroll } = useDebouncedScrollUpdate({
    panelDispatchStateChangeSelf,
  });

  const restoreScroll = () => {
    if (!mainContentRef.current) {
      return;
    }

    mainContentRef.current.scroll({
      top: scrollDistance,
      behavior: "instant",
    });
  };

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => restoreScroll());
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current);
    }
    return () => observer.disconnect();
  }, [historyPointer]);

  return { onScroll };
};
