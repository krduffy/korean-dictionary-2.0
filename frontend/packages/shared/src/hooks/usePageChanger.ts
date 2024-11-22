import { useEffect, useState } from "react";

export const usePageChanger = ({
  pageNum,
  setPageNum,
  maxPageNum,
}: {
  pageNum: number;
  // eslint-disable-next-line no-unused-vars
  setPageNum: (newPageNum: number) => void;
  maxPageNum: number;
}) => {
  const [currentlyTypedCustomPage, setCurrentlyTypedCustomPage] =
    useState<string>(String(pageNum));

  useEffect(() => {}, [currentlyTypedCustomPage]);

  const onClickPageDown = () => {
    setPageNum(Math.max(1, pageNum - 1));
  };

  const onClickPageUp = () => {
    setPageNum(Math.min(maxPageNum, pageNum + 1));
  };

  const onClickFirstPage = () => {
    setPageNum(1);
  };

  const onClickLastPage = () => {
    setPageNum(maxPageNum);
  };

  const handleCustomPageKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      let coercedValue = parseInt(currentlyTypedCustomPage, 10);

      if (isNaN(coercedValue) || coercedValue < 1) {
        coercedValue = 1;
      } else if (coercedValue > maxPageNum) {
        coercedValue = maxPageNum;
      }

      setCurrentlyTypedCustomPage(String(coercedValue));
      setPageNum(coercedValue);
    }
  };

  const handleCustomPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentlyTypedCustomPage(e.target.value);
  };

  const grayOutPageDown = pageNum <= 1;
  const grayOutPageUp = pageNum >= maxPageNum;
  const grayOutCustomPage = maxPageNum === 1;

  return {
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
  };
};
