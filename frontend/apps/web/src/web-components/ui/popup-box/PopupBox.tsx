import { useRef } from "react";
import { createPortal } from "react-dom";
import { usePopupBox } from "./usePopupBox";
import { PopupBoxArgs } from "./popupBoxTypes";

export const PopupBox = ({
  children,
  relativeTo,
  positioning,
  className,
}: PopupBoxArgs) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { x, y } = usePopupBox({
    popupBoxRef: popupRef,
    relativeToBox: relativeTo ?? undefined,
    containingBox: document.body,
    positioning: positioning,
  });

  return createPortal(
    <div
      style={{
        left: x,
        top: y,
        position: "fixed",
        zIndex: 1000,
      }}
      ref={popupRef}
      className={`${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
