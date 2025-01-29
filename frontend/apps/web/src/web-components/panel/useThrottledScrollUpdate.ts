import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { useRef } from "react";

/* exact number subject to change */
export const SCROLL_UPDATE_DEBOUNCE_TIME_MS = 500;

export const useThrottledScrollUpdate = ({
  panelDispatchStateChangeSelf,
}: {
  panelDispatchStateChangeSelf: (value: PanelStateAction) => void;
}) => {
  const debounceScrollUpdate = useRef<boolean>(false);
  const queuedScrollUpdateDistance = useRef<number | null>(null);

  const dispatchUpdateScrollStateChange = (newScrollDistance: number) => {
    console.log("dispatching updating for scroll");
    panelDispatchStateChangeSelf({
      type: "update_scroll_distance",
      scrollDistance: newScrollDistance,
    });
  };

  const onScroll: React.UIEventHandler<HTMLDivElement> = (uiHandler) => {
    const newScrollDistance = uiHandler.currentTarget.scrollTop;

    if (debounceScrollUpdate.current) {
      queuedScrollUpdateDistance.current = newScrollDistance;
    } else {
      debounceScrollUpdate.current = true;

      setTimeout(() => {
        if (queuedScrollUpdateDistance.current !== null) {
          dispatchUpdateScrollStateChange(queuedScrollUpdateDistance.current);
          queuedScrollUpdateDistance.current = null;
        }

        debounceScrollUpdate.current = false;
      }, SCROLL_UPDATE_DEBOUNCE_TIME_MS);

      dispatchUpdateScrollStateChange(newScrollDistance);
    }
  };

  return { onScroll };
};
