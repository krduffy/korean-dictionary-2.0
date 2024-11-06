import { DetailedKoreanType } from "@repo/shared/types/dictionaryItemProps";

export const KoreanDetailDisplay = ({ data }: { data: DetailedKoreanType }) => {
  return <div>{data.word}</div>;
};
