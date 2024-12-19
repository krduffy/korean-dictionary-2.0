import { useLayoutEffect, useState } from "react";
import { Coordinates, Positioning } from "./PopupBox";
import { getCoords } from "./positioningCalculations";
import { useResizeObserver } from "./useResizeObserver";

export const usePopupBox = ({
  popupBoxRef,
  relativeToBox,
  containingBox,
  positioning,
}: {
  popupBoxRef: React.MutableRefObject<HTMLElement | null>;
  relativeToBox: HTMLElement | undefined;
  containingBox: HTMLElement | undefined;
  positioning: Positioning;
}) => {
  const [boxCoords, setBoxCoords] = useState<Coordinates>({ x: 0, y: 0 });

  const { size: popupBoxDim } = useResizeObserver({ ref: popupBoxRef });

  useLayoutEffect(() => {
    if (popupBoxDim && relativeToBox) {
      const relativeToBoxDim = relativeToBox.getBoundingClientRect();
      const containingBoxDim = containingBox?.getBoundingClientRect();

      setBoxCoords(
        getCoords(
          { height: popupBoxDim.height, width: popupBoxDim.width },
          relativeToBoxDim,
          positioning,
          containingBoxDim
        )
      );
    }
  }, [popupBoxDim, relativeToBox, containingBox, positioning]);

  return boxCoords;
};
