import { DetailedKoreanType } from "@repo/shared/types/dictionaryItemProps";
import { DetailedSenseView } from "./DetailedSenseView";

export const KoreanDetailDisplay = ({
  data,
  dropdownStates,
}: {
  data: DetailedKoreanType;
  dropdownStates: boolean[];
}) => {
  return (
    <div>
      <div className="text-3xl">
        <span>{data.word}</span>
        <span>{data.origin}</span>
      </div>

      {data.senses.map((senseData, id) => (
        <DetailedSenseView
          key={senseData.target_code}
          data={senseData}
          dropdownState={dropdownStates[id] ?? false}
        />
      ))}
    </div>
  );
};
