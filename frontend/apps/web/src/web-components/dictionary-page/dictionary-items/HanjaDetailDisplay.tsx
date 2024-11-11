import { DetailedHanjaType } from "@repo/shared/types/dictionaryItemProps";

export const HanjaDetailDisplay = ({ data }: { data: DetailedHanjaType }) => {
  return <div>{data.character}</div>;
};
