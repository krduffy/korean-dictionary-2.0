import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { PopupBox } from "../misc/PopupBox";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { useHanjaPopupBox } from "../../../web-hooks/useHanjaPopupBox";
import { useRef } from "react";
import { LoadingIndicator } from "../misc/LoadingIndicator";
import { PanelSpecificDispatcher } from "../../dictionary-page/panel/PanelSpecificDispatcher";
import { ErrorMessage } from "../misc/ErrorMessage";
import { isHanjaPopupDataType } from "@repo/shared/types/typeGuards";
import { HanjaPopupType } from "@repo/shared/types/dictionaryItemProps";
import { HanjaPopupBox } from "./HanjaPopupBox";

export const StringWithHanja = ({ string }: { string: string }) => {
  const isolateHanja = (string: string) => {
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return string.split(/([\u4e00-\u9fff])/g).filter((str) => str.length > 0);
  };

  const isSingleHanja = (string: string) => {
    if (string.length !== 1) return false;
    const charCode = string.charCodeAt(0);
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return charCode >= 0x4e00 && charCode <= 0x9fff;
  };

  return (
    <>
      {isolateHanja(string).map((substring, id) => {
        if (isSingleHanja(substring)) {
          return <HanjaWithPopupBox key={id} character={substring} />;
        } else {
          return <span key={id}>{substring}</span>;
        }
      })}
    </>
  );
};

export const HanjaWithPopupBox = ({ character }: { character: string }) => {
  const { showHoverBox, handleMouseEnter, handleMouseLeave } =
    useHanjaPopupBox();

  const spanRef = useRef(null);

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PanelSpecificDispatcher
          panelStateAction={{ type: "push_hanja_detail", character: character }}
        >
          <span>{character}</span>
        </PanelSpecificDispatcher>
      </span>
      {showHoverBox && (
        <PopupBox targetElement={spanRef.current}>
          <HanjaPopupBox character={character} />
        </PopupBox>
      )}
    </>
  );
};
