import { useLayoutEffect, useState } from "react";
import { Coordinates, Positioning } from "./popupBoxTypes";
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
    const reposition = () => {
      if (popupBoxDim && relativeToBox && containingBox) {
        const relativeToBoxDim = relativeToBox.getBoundingClientRect();
        const containingBoxDim = containingBox?.getBoundingClientRect();

        const newCoords = getCoords(
          { height: popupBoxDim.height, width: popupBoxDim.width },
          relativeToBoxDim,
          containingBoxDim,
          positioning
        );

        if (newCoords !== null) setBoxCoords(newCoords);
      }
    };

    reposition();

    window.addEventListener("resize", reposition);

    return () => window.removeEventListener("resize", reposition);
  }, [popupBoxDim, relativeToBox, containingBox, positioning]);

  return boxCoords;
};
