import {
  hasBatchim,
  longNumberToFormatted,
} from "@repo/shared/utils/koreanLangUtils";
import { API_PAGE_SIZE } from "@repo/shared/constants";
import { isNumber } from "@repo/shared/types/guardUtils";
import { JsonDataType } from "@repo/shared/types/apiCallTypes";

export const NoResultsMessage = ({ searchTerm }: { searchTerm: string }) => {
  const searchTermHasBatchim = hasBatchim(searchTerm);
  const topicMarker =
    searchTermHasBatchim === true
      ? "은"
      : searchTermHasBatchim === false
        ? "는"
        : "";

  return (
    <div className="no-results-indicator">
      검색어 {'"'}
      {searchTerm}
      {'"'}
      {topicMarker} 결과가 없습니다.
    </div>
  );
};

export const ResultCountMessage = ({
  pageNum,
  responseCount,
}: {
  pageNum: number;
  responseCount: JsonDataType | undefined;
}) => {
  /* if result count is 0 then the no result message above should be shown instead of
     this message + the mapped results and the page changer */
  if (!isNumber(responseCount) || responseCount < 1) {
    return;
  }

  const resultNumberString = longNumberToFormatted(responseCount);
  const firstResultShown = (pageNum - 1) * API_PAGE_SIZE + 1;
  const lastResultShown = Math.min(responseCount, pageNum * API_PAGE_SIZE);

  return (
    <div>
      결과 {resultNumberString}건 ({firstResultShown}-{lastResultShown})
    </div>
  );
};
