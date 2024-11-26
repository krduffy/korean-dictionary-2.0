import { DetailedHanjaType } from "@repo/shared/types/dictionaryItemProps";
import { memo } from "react";

export const HanjaDetailDisplay = memo(
  ({ data }: { data: DetailedHanjaType }) => {
    return <div>{data.character}</div>;
  }
);
