import { ReactNode, useRef, useState } from "react";
import { PopupBox, Positioning } from "./popup-box/PopupBox";
import { CloseButton } from "./CloseButton";

export const ButtonWithClickDropdown = ({
  title = "",
  buttonContent,
  dropdownContent,
  positioning,
  addXInTopRight = false,
}: {
  title?: string;
  buttonContent: ReactNode;
  dropdownContent: ReactNode;
  positioning: Positioning;
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
        <PopupBox relativeTo={buttonRef.current} positioning={positioning}>
          {dropdownContent}
          {addXInTopRight && <CloseButton onClick={() => setShow(false)} />}
        </PopupBox>
      )}
    </>
  );
};
