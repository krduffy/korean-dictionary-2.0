import { DetailedHanjaType } from "@repo/shared/types/dictionaryItemProps";
import { memo, useState } from "react";
import { HanjaDetailHanziWriter } from "./hanja-writing/HanjaDetailHanziWriter";

export const HanjaDetailDisplay = memo(
  ({ data }: { data: DetailedHanjaType }) => {
    const [writerLoadError, setWriterLoadError] = useState(false);

    return (
      <>
        <div className="flex flex-row min-h-48">
          <div className="w-[60%] flex-1">
            <TopLeft data={data} />
          </div>
          {!writerLoadError && (
            <div className="w-[40%]">
              <HanjaDetailHanziWriter
                character={data.character}
                setWriterLoadError={setWriterLoadError}
              />
            </div>
          )}
        </div>
      </>
    );
  }
);

const TopLeft = ({ data }: { data: DetailedHanjaType }) => {
  return (
    <div>
      <div>{data.character}</div>
    </div>
  );
};
