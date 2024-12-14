import {
  HistoryCenturyInfoType,
  HistoryInfoType,
  isHistoryCenturyInfo,
} from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { StringWithHanja } from "../../../../other/string-formatters/StringWithHanja";
import { isArrayOf } from "@repo/shared/types/guardUtils";

export const KoreanHistoryInfoSection = ({
  historyInfo,
}: {
  historyInfo: HistoryInfoType;
}) => {
  return (
    <div>
      <HistoryOverviewData historyInfo={historyInfo} />

      {historyInfo.history_sense_info.length > 0 && (
        <div className="curved-box-nest1">
          <div className="curved-box-header textcentered">세기별 용례</div>
          <div className="pad-10 full-width">
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
  );
};

const HistoryOverviewData = ({
  historyInfo,
}: {
  historyInfo: HistoryInfoType;
}) => {
  return (
    <table
      className="history-header-info-table tbmargin-10"
      style={{
        borderSpacing: "0px 10px",
      }}
    >
      <colgroup>
        <col width={"20%"} />
        <col width={"80%"} />
      </colgroup>

      <tbody>
        <tr className="tbpad-10">
          <th className="history-header-table-header">이형태</th>
          <td className="history-header-table-data">{historyInfo.allomorph}</td>
        </tr>
        <tr>
          <th className="history-header-table-header">변화</th>
          <td className="history-header-table-data tbpad-10">
            {historyInfo.word_form}
          </td>
        </tr>
        <tr>
          <th className="history-header-table-header">설명</th>
          <td className="history-header-table-data">{historyInfo.desc}</td>
        </tr>
      </tbody>
    </table>
  );
};

const CenturyTable = ({
  historyCenturiesInfo,
}: {
  historyCenturiesInfo: HistoryCenturyInfoType[];
}) => {
  console.log(historyCenturiesInfo);

  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <colgroup>
        <col width={"15%"} />
        <col width={"15%"} />
        <col width={"70%"} />
      </colgroup>

      <thead>
        <tr>
          <th className="tbpad-10 underlined">세기</th>
          <th className="tbpad-10 underlined">형태</th>
          <th className="tbpad-10 underlined">용례</th>
        </tr>
      </thead>

      <tbody>
        {historyCenturiesInfo.map((centuryInfo, id) => (
          <CenturyRow key={id} centuryInfo={centuryInfo} />
        ))}
      </tbody>
    </table>
  );
};

const CenturyRow = ({
  centuryInfo,
}: {
  centuryInfo: HistoryCenturyInfoType;
}) => {
  console.log(centuryInfo);

  return (
    <tr>
      <td>{centuryInfo.century}세기</td>
      <td>{centuryInfo.mark}</td>
      <td
        className="lrpad-10"
        style={{
          paddingBottom: "20px",
        }}
      >
        <ul>
          {centuryInfo.history_example_info?.map((example, innerId) => (
            <li key={innerId}>
              <div>
                <StringWithHanja string={example.example} />
              </div>

              <div className="source">
                <StringWithHanja string={example.source} />
              </div>
            </li>
          ))}
        </ul>
      </td>
    </tr>
  );
};
