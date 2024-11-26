import {
  hasBatchim,
  longNumberToFormatted,
} from "@repo/shared/utils/koreanLangUtils";
import { API_PAGE_SIZE } from "@repo/shared/constants";

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
  totalResults,
}: {
  pageNum: number;
  totalResults: number;
}) => {
  const resultNumberString = longNumberToFormatted(totalResults);
  const firstResultShown = (pageNum - 1) * API_PAGE_SIZE + 1;
  const lastResultShown = Math.min(totalResults, pageNum * API_PAGE_SIZE);

  return (
    <div>
      결과 {resultNumberString}건 ({firstResultShown}-{lastResultShown})
    </div>
  );
};
