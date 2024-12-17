import { ReactNode, useRef, useState } from "react";
import { PopupBox, PopupBoxArgs } from "./PopupBox";
import { CloseButton } from "./CloseButton";

export type AllowedPopupBoxArgs = {
  align?: PopupBoxArgs["align"];
};

export const ButtonWithClickDropdown = ({
  title = "",
  buttonContent,
  dropdownContent,
  popupBoxArgs,
  addXInTopRight = false,
}: {
  title?: string;
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

  return (
    <>
      <button
        className="h-full w-full"
        title={title}
        ref={buttonRef}
        onClick={handleClick}
      >
        {buttonContent}
      </button>
      {show && (
        <PopupBox
          targetElement={buttonRef.current}
          constrainToWindow={true}
          {...popupBoxArgs}
        >
          {dropdownContent}
          {addXInTopRight && <CloseButton onClick={() => setShow(false)} />}
        </PopupBox>
      )}
    </>
  );
};
