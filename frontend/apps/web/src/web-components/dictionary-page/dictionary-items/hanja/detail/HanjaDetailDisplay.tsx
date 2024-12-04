import { DetailedHanjaType } from "@repo/shared/types/dictionaryItemProps";
import { memo } from "react";
import { HanjaDetailDisplayTopInfo } from "./HanjaDetailDisplayTopInfo";

export const HanjaDetailDisplay = memo(
  ({ data }: { data: DetailedHanjaType }) => {
    return (
      <>
        <HanjaDetailDisplayTopInfo data={data} />
      </>
    );
  }
);
