import { PopupBox } from "../../../../ui/PopupBox";
import { useHanjaPopupBox } from "./useHanjaPopupBox";
import { memo, useRef } from "react";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { HanjaPopupView } from "../../../api-fetchers/HanjaPopupView";
import { DetailViewLinkStyler } from "../../../../text-formatters/SpanStylers";

export const StringWithHanja = memo(({ string }: { string: string }) => {
  const isolatedHanja =
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    string.split(/([\u4e00-\u9fff])/g).filter((str) => str.length > 0);

  const isSingleHanja = (string: string) => {
    if (string.length !== 1) return false;
    const charCode = string.charCodeAt(0);
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return charCode >= 0x4e00 && charCode <= 0x9fff;
  };

  return (
    <>
      {isolatedHanja.map((substring, id) => {
        if (isSingleHanja(substring)) {
          return <HanjaWithPopupBox key={id} character={substring} />;
        } else {
          return <span key={id}>{substring}</span>;
        }
      })}
    </>
  );
});

const HanjaWithPopupBox = ({ character }: { character: string }) => {
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
          <DetailViewLinkStyler>{character}</DetailViewLinkStyler>
        </PanelSpecificDispatcher>
      </span>
      {showHoverBox && (
        <PopupBox targetElement={spanRef.current}>
          <HanjaPopupView character={character} />
        </PopupBox>
      )}
    </>
  );
};
