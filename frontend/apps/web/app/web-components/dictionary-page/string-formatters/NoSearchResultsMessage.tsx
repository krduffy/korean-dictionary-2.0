import { getTopicMarker } from "@repo/shared/utils/koreanLangUtils";

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
