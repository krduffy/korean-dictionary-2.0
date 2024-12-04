import { MeaningReadings } from "@repo/shared/types/dictionaryItemProps";

export const MeaningReadingsDiv = ({
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
