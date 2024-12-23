import {
  HistoryCenturyInfoType,
  HistoryInfoType,
} from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import {
  AccentedTextWithBorder,
  Source,
} from "../../../../text-formatters/SpanStylers";
import { NonModernKoreanText } from "../../../../text-formatters/Fonts";
import { ExampleStringWithHanja } from "../../shared/formatted-string/FormattedString";
import { HideableDropdownNoTruncation } from "../../shared/ReusedFormatters";

export const KoreanHistoryInfoSection = ({
  historyInfo,
  dropdownState,
}: {
  historyInfo: HistoryInfoType;
  dropdownState: boolean;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const toggleHistoryVisible = (newVisible: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_interaction_data",
      key: "historyDroppedDown",
      newValue: newVisible,
    });
  };

  return (
    <HideableDropdownNoTruncation
      title="역사 정보"
      classes={{
        topBarClassName: "py-4 bg-[color:--surface-color]",
        titleClassName: "text-[130%]",
        childrenClassName: "pt-4",
      }}
      droppedDown={dropdownState}
      onDropdownStateToggle={toggleHistoryVisible}
    >
      <div className="p-4 flex flex-col gap-4">
        <HistoryOverviewData historyInfo={historyInfo} />

        {historyInfo.history_sense_info.length > 0 && (
          <div>
            <div
              className="border-2 border-[color:--border-color] 
            rounded-t-xl text-center bg-[color:--surface-color] 
            text-[130%] py-1"
            >
              세기별 용례
            </div>
            <div className="rounded-b-xl border-x-2 border-b-2 border-[color:--border-color]">
              <CenturyTable
                /* data from korean lang institute is strangely formatted
                 history sense info has length 1 and the only item is object with
                 history_century_info as the only key */
                historyCenturiesInfo={
                  historyInfo.history_sense_info[0].history_century_info
                }
              />
            </div>
          </div>
        )}
      </div>
      <footer className="p-4">
        <Source>출처: 우리말샘</Source>
      </footer>
    </HideableDropdownNoTruncation>
  );
};

const HistoryOverviewData = ({
  historyInfo,
}: {
  historyInfo: HistoryInfoType;
}) => {
  const rowData = [
    { name: "이형태", data: historyInfo.allomorph },
    { name: "변화", data: historyInfo.word_form },
    { name: "설명", data: historyInfo.desc },
  ];

  return (
    <div className="flex flex-col gap-2">
      {rowData.map(({ name, data }) => (
        <HistoryOverviewTableRow key={name} name={name} data={data} />
      ))}
    </div>
  );
};

const HistoryOverviewTableRow = ({
  name,
  data,
}: {
  name: string;
  data: string;
}) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <div className="text-center w-[20%]">
        <div className="flex flex-1 justify-center">
          <AccentedTextWithBorder accentNumber={3}>
            {name}
          </AccentedTextWithBorder>
        </div>
      </div>
      <div className="w-[80%] self-center">{data}</div>
    </div>
  );
};

const CenturyTable = ({
  historyCenturiesInfo,
}: {
  historyCenturiesInfo: HistoryCenturyInfoType[];
}) => {
  const getRowBorderStyleString = (
    includeTop: boolean,
    includeBottom: boolean
  ) => {
    return `border-double border-[color:--border-color] ${includeTop ? "border-t-4" : ""} ${includeBottom ? "border-b-4" : ""}`;
  };

  const getRowItemBorderStyleString = (
    includeLeft: boolean,
    includeRight: boolean
  ) => {
    return `border-double border-[color:--border-color] ${includeLeft ? "border-l-4" : ""} ${includeRight ? "border-r-4" : ""}`;
  };

  return (
    <table className="w-full border-collapse">
      <colgroup>
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[70%]" />
      </colgroup>

      <thead>
        <tr className={getRowBorderStyleString(false, true)}>
          <th className={`py-3 ${getRowItemBorderStyleString(false, true)}`}>
            세기
          </th>
          <th className={`py-3 ${getRowItemBorderStyleString(true, true)}`}>
            형태
          </th>
          <th className={`py-3 ${getRowItemBorderStyleString(true, false)}`}>
            용례
          </th>
        </tr>
      </thead>

      <tbody>
        {historyCenturiesInfo.map((centuryInfo, id, arr) => {
          const applyBorder = getRowBorderStyleString(
            id !== 0,
            id !== arr.length - 1
          );

          return (
            <tr className={applyBorder} key={id}>
              <CenturyRowData
                centuryInfo={centuryInfo}
                getRowItemBorderStyleString={getRowItemBorderStyleString}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CenturyRowData = ({
  centuryInfo,
  getRowItemBorderStyleString,
}: {
  centuryInfo: HistoryCenturyInfoType;
  getRowItemBorderStyleString: (
    includeLeft: boolean,
    includeRight: boolean
  ) => string;
}) => {
  return (
    <>
      <td
        className={`p-4 text-center ${getRowItemBorderStyleString(false, true)}`}
      >
        {centuryInfo.century}세기
      </td>
      <td
        className={`p-4 text-center ${getRowItemBorderStyleString(true, true)}`}
      >
        {centuryInfo.mark}
      </td>
      <td className={`p-4 ${getRowItemBorderStyleString(true, false)}`}>
        <ul className="space-y-4">
          {centuryInfo.history_example_info?.map((example, exampleNumber) => (
            <li key={exampleNumber}>
              <NonModernKoreanText>
                <ExampleStringWithHanja string={example.example} />
              </NonModernKoreanText>

              <Source>출처: {example.source}</Source>
            </li>
          ))}
        </ul>
      </td>
    </>
  );
};
