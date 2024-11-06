import { usePageChanger } from "@repo/shared/hooks/usePageChanger";

import "./styles.css";

export type PageChangerArgs = {
  pageNum: number;
  setPageNum: (n: number) => void;
  maxPageNum: number;
};

export const PageChanger = ({
  pageNum,
  setPageNum,
  maxPageNum,
}: PageChangerArgs) => {
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
    <div className="flex justify-between px-4">
      <span onClick={onClickFirstPage}>1</span>
      <span onClick={onClickPageDown}>{"<<"}</span>
      <input
        className="text-center border-none bg-transparent no-spinners"
        type="number"
        inputMode="numeric"
        value={currentlyTypedCustomPage}
        onKeyDown={handleCustomPageKeyDown}
        onChange={handleCustomPageChange}
      />
      <span onClick={onClickPageUp}>{">>"}</span>
      <span onClick={onClickLastPage}>{maxPageNum}</span>
    </div>
  );
};
