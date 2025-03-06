import { memo, ReactNode, useRef, useState } from "react";
import { HanjaDetailHanziWriter } from "./HanjaDetailHanziWriter";
import { HanjaCharacterKnownStudiedTogglers } from "../../shared/known-studied/KnownStudiedDisplayers";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { Copier } from "../../../../ui/Copier";
import { DetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { MeaningReadingsDisplay } from "../MeaningReadingsDisplay";
import {
  convertHanjaResultRankingIntoNumberOfStars,
  ResultRankingStars,
} from "../../shared/ResultRankingStars";
import { HanjaSearchConfig } from "@repo/shared/types/views/searchConfigTypes";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { Search } from "lucide-react";
import { HanjaDetailTopInfoSources } from "./HanjaDetailTopInfoSources";

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
    <>
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
            className={`flex justify-center items-center ${
              belowCutoff ? "w-full" : "w-[30%]"
            }`}
          >
            <HanjaDetailHanziWriter
              character={data.character}
              onWriterLoadError={() => setWriterLoadError(true)}
            />
          </div>
        )}
      </div>
      <div className="pt-4">
        <HanjaDetailTopInfoSources
          radicalSource={data.radical_source}
          character={data.character}
          hasHanziWriterSource={!writerLoadError}
        />
      </div>
    </>
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
    </div>
  );
};

const HanjaMainInfoTable = memo(({ data }: { data: DetailedHanjaType }) => {
  /* neither num rows nor num cols can exceed 9 due to calc of key below (should only ever be
     3 rows and 2 cols */
  const tableData: { label: string; item: ReactNode }[][] = [
    /* array of rows (which are arrays of cols) */
    [
      {
        label: "부수",
        item: (
          <HanjaItemWithSearchButton
            printedValue={data.radical}
            dataName="radical"
            data={data.radical}
          />
        ),
      },
      {
        label: "유니코드",
        item: (
          <span className="flex flex-row gap-3">
            {"0x" + data.character.charCodeAt(0).toString(16).toUpperCase()}
            <Copier textToCopy={data.character} />
          </span>
        ),
      },
    ],
    [
      {
        label: "교육용",
        item: (
          <HanjaItemWithSearchButton
            printedValue={data.grade_level}
            dataName="grade_level"
            data={data.grade_level}
          />
        ),
      },
      {
        label: "급수별",
        item: (
          <HanjaItemWithSearchButton
            printedValue={data.exam_level}
            dataName="exam_level"
            data={{
              level: data.exam_level,
              operand: "eq",
            }}
          />
        ),
      },
    ],
    [
      {
        label: "모양자 분해",
        item: data.decomposition && (
          <HanjaItemWithSearchButton
            printedValue={data.decomposition}
            dataName="decomposition"
            data={data.decomposition}
          />
        ),
      },
      {
        label: "획수",
        item: (
          <HanjaItemWithSearchButton
            printedValue={`${data.strokes}획`}
            dataName="strokes"
            data={{
              strokes: data.strokes,
              operand: "eq",
            }}
          />
        ),
      },
    ],
  ];

  return (
    <div className="w-full h-full grid grid-rows-3 grid-cols-2 gap-x-8 gap-y-1 place-items-center justify-items-end">
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

const HanjaItemWithSearchButton = <DataType extends keyof HanjaSearchConfig>({
  printedValue,
  dataName,
  data,
}: {
  printedValue: string;
  dataName: DataType;
  data: HanjaSearchConfig[DataType];
}) => {
  return (
    <div className="flex flex-row gap-3 items-center justify-center">
      <div>{printedValue}</div>
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_hanja_search",
          searchConfig: {
            search_term: "",
            page: 1,
            [dataName]: data,
          },
        }}
      >
        <div title="검색">
          <Search className="cursor-pointer aspect-square w-4 h-4" />
        </div>
      </PanelSpecificDispatcher>
    </div>
  );
};

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
      col-start-${col} col-end-${col + 1} w-full`}
    >
      <div>{label}</div>
      <div>{item}</div>
    </div>
  );
};
