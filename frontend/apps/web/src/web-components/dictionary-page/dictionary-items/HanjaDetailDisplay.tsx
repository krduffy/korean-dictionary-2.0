import { DetailedHanjaType } from "@repo/shared/types/dictionaryItemProps";
import { memo, useState } from "react";
import { HanjaDetailHanziWriter } from "./hanja-writing/HanjaDetailHanziWriter";

export const HanjaDetailDisplay = memo(
  ({ data }: { data: DetailedHanjaType }) => {
    const [writerLoadError, setWriterLoadError] = useState(false);

    return (
      <>
        <div>{data.character}</div>
        <HanjaDetailHanziWriter
          character={data.character}
          setWriterLoadError={setWriterLoadError}
        />
      </>
    );
  }
);
