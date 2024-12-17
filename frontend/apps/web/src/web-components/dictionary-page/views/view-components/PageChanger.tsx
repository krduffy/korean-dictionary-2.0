import { usePageChanger } from "@repo/shared/hooks/usePageChanger";

import "./no-spinner-styles.css";
import { JsonDataType } from "@repo/shared/types/apiCallTypes";
import { isNumber } from "@repo/shared/types/guardUtils";
import { API_PAGE_SIZE } from "@repo/shared/constants";

export const PageChanger = ({
  pageNum,
  setPageNum,
  responseCount,
}: {
  pageNum: number;
  setPageNum: (n: number) => void;
  responseCount: JsonDataType | undefined;
}) => {
  if (!isNumber(responseCount)) {
    console.warn(`responseCount must be a number but is ${responseCount}.`);
    return <div>페이지수: {pageNum}</div>;
  }

  return (
    <FunctionalPageChanger
      pageNum={pageNum}
      setPageNum={setPageNum}
      maxPageNum={Math.ceil(responseCount / API_PAGE_SIZE)}
    />
  );
};

const FunctionalPageChanger = ({
  pageNum,
  setPageNum,
  maxPageNum,
}: {
  pageNum: number;
  setPageNum: (n: number) => void;
  maxPageNum: number;
}) => {
  const {
    onClickPageDown,
    onClickPageUp,
    onClickFirstPage,
    onClickLastPage,
    handleCustomPageKeyDown,
    handleCustomPageChange,
    grayOutPageDown,
    grayOutPageUp,
    grayOutCustomPage,
    currentlyTypedCustomPage,
  } = usePageChanger({ pageNum, setPageNum, maxPageNum });

  return (
    <div className="w-full px-[10%] flex justify-between">
      <span
        title="첫 페이지로 가기"
        className="w-[15%]"
        onClick={onClickFirstPage}
        style={{
          cursor: grayOutPageDown ? "not-allowed" : "pointer",
        }}
      >
        1
      </span>
      <span
        title="한 페이지 뒤로 가기"
        className="w-[15%]"
        onClick={onClickPageDown}
        style={{
          cursor: grayOutPageDown ? "not-allowed" : "pointer",
        }}
      >
        {"<<"}
      </span>
      <input
        title="페이지 바꾸기"
        className="text-center border-none bg-transparent no-spinners w-[40%]"
        type="number"
        inputMode="numeric"
        value={currentlyTypedCustomPage}
        onKeyDown={handleCustomPageKeyDown}
        onChange={handleCustomPageChange}
        style={{
          cursor: grayOutCustomPage ? "not-allowed" : "pointer",
        }}
      />
      <span
        title="한 페이지 앞으로 가기"
        className="w-[15%]"
        onClick={onClickPageUp}
        style={{
          cursor: grayOutPageUp ? "not-allowed" : "pointer",
        }}
      >
        {">>"}
      </span>
      <span
        title="마지막 페이지로 가기"
        className="w-[15%] cursor-pointer"
        onClick={onClickLastPage}
        style={{
          cursor: grayOutPageUp ? "not-allowed" : "pointer",
        }}
      >
        {/* casted to string to get rid of error when maxPageNum is initially NaN */}
        {String(maxPageNum)}
      </span>
    </div>
  );
};
