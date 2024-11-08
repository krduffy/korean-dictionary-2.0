import { DetailedKoreanType } from "@repo/shared/types/dictionaryItemProps";
import { DetailedSenseView } from "./DetailedSenseView";

export const KoreanDetailDisplay = ({ data }: { data: DetailedKoreanType }) => {
  return (
    <div>
      <div className="text-3xl">
        <span>{data.word}</span>
        <span>{data.origin}</span>
      </div>

      {data.senses.map((senseData) => (
        <DetailedSenseView key={senseData.target_code} data={senseData} />
      ))}
    </div>
  );
};
