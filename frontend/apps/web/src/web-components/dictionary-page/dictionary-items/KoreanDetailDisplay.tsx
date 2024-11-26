import { DetailedKoreanType } from "@repo/shared/types/dictionaryItemProps";
import { DetailedSenseView } from "./DetailedSenseView";
import { StringWithHanja } from "../../other/string-formatters/StringWithHanja";
import { KoreanHistoryInfoSection } from "./KoreanHistoryInfo";

export const KoreanDetailDisplay = ({
  data,
  dropdownStates,
}: {
  data: DetailedKoreanType;
  dropdownStates: boolean[];
}) => {
  return (
    <div>
      <div
        style={{
          fontSize: "250%",
        }}
        className="mb-6"
      >
        <span>{data.word} </span>
        <StringWithHanja string={data.origin} />
      </div>

      {data.senses.map((senseData, id) => (
        <div key={senseData.target_code} className="mb-4">
          <DetailedSenseView
            senseData={senseData}
            dropdownState={dropdownStates[id] ?? false}
          />
        </div>
      ))}

      {data.history_info && (
        <KoreanHistoryInfoSection historyInfo={data.history_info} />
      )}
    </div>
  );
};
