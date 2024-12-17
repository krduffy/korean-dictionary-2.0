import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useLayoutEffect } from "react";

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

  const onScroll: React.UIEventHandler<HTMLDivElement> = (uiHandler) => {
    const newScrollDistance = uiHandler.currentTarget.scrollTop;
    panelDispatchStateChangeSelf({
      type: "update_scroll_distance",
      scrollDistance: newScrollDistance,
    });
  };

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
