import { MeaningReadings } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";

export const MeaningReadingsDisplay = ({
  meaningReadings,
}: {
  meaningReadings: MeaningReadings[];
}) => {
  return (
    <div>
      {meaningReadings.map((mr, id, arr) => (
        <span key={id}>
          <span>{mr.meaning} </span>
          <span className="[color:--accent-1]">{mr.readings.join("/")}</span>
          {id !== arr.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
};
