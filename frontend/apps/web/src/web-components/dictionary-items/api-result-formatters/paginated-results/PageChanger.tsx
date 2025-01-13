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
    return;
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
      <ChangePageButton
        onClick={onClickFirstPage}
        clickingHasNoEffect={grayOutPageDown}
        title="첫 페이지로 가기"
        content="1"
      />
      <ChangePageButton
        onClick={onClickPageDown}
        clickingHasNoEffect={grayOutPageDown}
        title="한 페이지 뒤로 가기"
        content="<<"
      />
      <CurrentPageDisplayerAndEditor
        currentlyTypedCustomPage={currentlyTypedCustomPage}
        handleCustomPageKeyDown={handleCustomPageKeyDown}
        handleCustomPageChange={handleCustomPageChange}
        grayOutCustomPage={grayOutCustomPage}
      />
      <ChangePageButton
        onClick={onClickPageUp}
        clickingHasNoEffect={grayOutPageUp}
        title="한 페이지 앞으로 가기"
        content=">>"
      />
      <ChangePageButton
        onClick={onClickLastPage}
        clickingHasNoEffect={grayOutPageUp}
        title="마지막 페이지로 가기"
        content={String(maxPageNum)}
      />
    </div>
  );
};

const ChangePageButton = ({
  onClick,
  clickingHasNoEffect,
  title,
  content,
}: {
  onClick: () => void;
  clickingHasNoEffect: boolean;
  title: string;
  content: string;
}) => {
  return (
    <button
      title={title}
      className="w-[15%] cursor-pointer"
      onClick={onClick}
      style={{
        cursor: clickingHasNoEffect ? "not-allowed" : "pointer",
      }}
    >
      {clickingHasNoEffect ? "—" : content}
    </button>
  );
};

const CurrentPageDisplayerAndEditor = ({
  currentlyTypedCustomPage,
  handleCustomPageKeyDown,
  handleCustomPageChange,
  grayOutCustomPage,
}: {
  currentlyTypedCustomPage: string;
  handleCustomPageKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCustomPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  grayOutCustomPage: boolean;
}) => {
  return (
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
  );
};
