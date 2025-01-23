import { memo, ReactNode, useRef, useState } from "react";
import { HanjaDetailHanziWriter } from "./HanjaDetailHanziWriter";
import { HanjaCharacterKnownStudiedTogglers } from "../../shared/known-studied/KnownStudiedDisplayers";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { Copier } from "../../../../ui/Copier";
import { DetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { MeaningReadingsDisplay } from "../MeaningReadingsDisplay";
import { Href, Source } from "../../../../text-formatters/SpanStylers";
import {
  convertHanjaResultRankingIntoNumberOfStars,
  ResultRankingStars,
} from "../../shared/ResultRankingStars";

export const HanjaDetailDisplayTopInfo = ({
  data,
}: {
  data: DetailedHanjaType;
}) => {
  const [writerLoadError, setWriterLoadError] = useState(false);

  /* the hanzi writer should be to the right of main info unless the screen is too narrow;
       in this case it will be below */
  const detailDisplayTopRef = useRef<HTMLDivElement | null>(null);

  const { belowCutoff } = useWidthObserver({
    ref: detailDisplayTopRef,
    cutoff: 500,
  });

  return (
    <div
      className={`flex min-h-48 gap-${belowCutoff ? "6" : "2"} ${belowCutoff ? "flex-col" : "flex-row"}`}
      ref={detailDisplayTopRef}
    >
      <div
        className={`flex-1 ${belowCutoff || writerLoadError ? "w-full" : "w-[70%]"}`}
      >
        <HanjaMainInfo data={data} />
      </div>
      {!writerLoadError && (
        <div
          className={`flex flex-col gap-2 justify-center items-center ${
            belowCutoff ? "w-full" : "w-[30%]"
          }`}
        >
          <HanjaDetailHanziWriter
            character={data.character}
            onWriterLoadError={() => setWriterLoadError(true)}
          />
          <br />
          <Source>
            <p className="text-center">
              한자 획순 재생기 출처:{" "}
              <Href urlString="https://hanziwriter.org/">hanziwriter</Href>
            </p>
          </Source>
        </div>
      )}
    </div>
  );
};

/* always present even if the hanja/hanzi writer is not */
const HanjaMainInfo = ({ data }: { data: DetailedHanjaType }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* top level; character and meaning readings */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-[300%] text-[color:--accent-1]">
            {data.character}
          </h1>
          <h3 className="text-[150%] flex-1">
            <MeaningReadingsDisplay meaningReadings={data.meaning_readings} />
          </h3>
          <div className="flex justify-center items-center">
            <ResultRankingStars
              numStars={convertHanjaResultRankingIntoNumberOfStars(
                data.result_ranking
              )}
              widthAndHeightPx={32}
            />
          </div>
        </div>
        {data.user_data && (
          <HanjaCharacterKnownStudiedTogglers
            pk={data.character}
            isKnown={data.user_data.is_known}
            isStudied={data.user_data.is_studied}
          />
        )}
      </div>
      {/* lower level; table of other info */}
      <HanjaMainInfoTable data={data} />
      <br />
      <HanjaMainInfoSources
        radicalSource={data.radical_source}
        character={data.character}
      />
    </div>
  );
};

const HanjaMainInfoSources = ({
  radicalSource,
  character,
}: {
  radicalSource: "namuwiki" | "makemeahanzi";
  character: string;
}) => {
  const fromNamuwiki = `훈음, ${radicalSource === "namuwiki" ? "부수, " : ""}교육용, 급수별, 획수`;
  const fromMakemeahanzi = `${radicalSource === "makemeahanzi" ? "부수, " : ""}모양자 분해`;

  return (
    <footer className="flex justify-between items-center gap-[20%]">
      <Source>
        <p>
          {fromNamuwiki} 출처:{" "}
          <Href urlString={`https://namu.wiki/w/${character}`}>나무위키</Href>
        </p>
      </Source>
      <Source>
        <p>
          {fromMakemeahanzi} 출처:{" "}
          <Href urlString={`https://github.com/skishore/makemeahanzi`}>
            makemeahanzi
          </Href>
        </p>
      </Source>
    </footer>
  );
};

const HanjaMainInfoTable = memo(({ data }: { data: DetailedHanjaType }) => {
  /* neither num rows nor num cols can exceed 9 due to calc of key below (should only ever be
     3 rows and 2 cols */
  const tableData: { label: string; item: ReactNode }[][] = [
    /* array of rows (which are arrays of cols) */
    [
      { label: "부수", item: data.radical },
      {
        label: "유니코드",
        item: (
          <span className="flex flex-row gap-2">
            {"0x" + data.character.charCodeAt(0).toString(16).toUpperCase()}
            <Copier textToCopy={data.character} />
          </span>
        ),
      },
    ],
    [
      { label: "교육용", item: data.grade_level },
      { label: "급수별", item: data.exam_level },
    ],
    [
      { label: "모양자 분해", item: data.decomposition },
      { label: "획수", item: data.strokes + "획" },
    ],
  ];

  return (
    <div className="w-full h-full grid grid-rows-3 grid-cols-2 gap-x-8 gap-y-1">
      {tableData.map((row, rowId) =>
        row.map((col, colId) => (
          <HanjaMainInfoTableItem
            key={rowId * 10 + colId}
            row={rowId + 1}
            col={colId + 1}
            label={col.label}
            item={col.item ?? "-"}
          />
        ))
      )}
    </div>
  );
});

const HanjaMainInfoTableItem = ({
  row,
  col,
  label,
  item,
}: {
  row: number;
  col: number;
  label: string;
  item: ReactNode;
}) => {
  return (
    <div
      className={`flex flex-row justify-between row-start-${row} row-end-${row + 1} 
      col-start-${col} col-end-${col + 1}`}
    >
      <div>{label}</div>
      <div>{item}</div>
    </div>
  );
};
