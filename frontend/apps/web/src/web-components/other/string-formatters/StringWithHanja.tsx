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
          <HanjaPopupBoxDisplay character={character} />
        </PopupBox>
      )}
    </>
  );
};

export const HanjaPopupBoxDisplay = ({ character }: { character: string }) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "popup_hanja", pk: character }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
    refetchDependencyArray: [character],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!response) {
    return (
      <ErrorMessage errorResponse={{ 오류: "api 요청은 응답이 없었습니다." }} />
    );
  }

  if (!isHanjaPopupDataType(response)) {
    return (
      <ErrorMessage
        errorResponse={{ 오류: "api 응답은 데이터 구조가 안 됩니다." }}
      />
    );
  }

  return successful && <HanjaPopupBoxContent data={response} />;
};

export const HanjaPopupBoxContent = ({ data }: { data: HanjaPopupType }) => {
  return <div>{data.character}</div>;
};
