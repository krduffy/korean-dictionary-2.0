import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";

export const HanjaSearchResult = ({
  result,
}: {
  result: HanjaSearchResultType;
}) => {
  return <div>{result.character}</div>;
};
