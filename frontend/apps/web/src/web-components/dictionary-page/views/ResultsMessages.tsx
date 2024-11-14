import { getTopicMarker } from "@repo/shared/utils/koreanLangUtils";
import { API_PAGE_SIZE } from "@repo/shared/constants";

export const NoResultsMessage = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <div className="no-results-indicator">
      검색어 {'"'}
      {searchTerm}
      {'"'}
      {getTopicMarker(searchTerm)} 결과가 없습니다.
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
  return (
    <div>
      결과 {totalResults}건 ({(pageNum - 1) * API_PAGE_SIZE + 1}-
      {Math.min(totalResults, pageNum * API_PAGE_SIZE)})
    </div>
  );
};
