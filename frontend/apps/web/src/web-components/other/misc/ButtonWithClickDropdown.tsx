import { ReactNode, useRef, useState } from "react";
import { PopupBox, PopupBoxArgs } from "./PopupBox";
import { X } from "lucide-react";

export type AllowedPopupBoxArgs = {
  align?: PopupBoxArgs["align"];
};

export const ButtonWithClickDropdown = ({
  buttonContent,
  dropdownContent,
  popupBoxArgs,
  addXInTopRight = false,
}: {
  buttonContent: ReactNode;
  dropdownContent: ReactNode;
  popupBoxArgs?: AllowedPopupBoxArgs;
  addXInTopRight?: boolean;
}) => {
  const [show, setShow] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShow(!show);
  };

  const closeButton = (
    <button className="absolute top-1 right-1" onClick={(e) => setShow(false)}>
      <X />
    </button>
  );

  return (
    <>
      <button className="h-full w-full" ref={buttonRef} onClick={handleClick}>
        {buttonContent}
      </button>
      {show && (
        <PopupBox
          targetElement={buttonRef.current}
          constrainToWindow={true}
          {...popupBoxArgs}
        >
          {dropdownContent}
          {addXInTopRight && closeButton}
        </PopupBox>
      )}
    </>
  );
};
