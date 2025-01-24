import {
  PatternType,
  RegionInfoType,
} from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import { StringWithNLPAndHanja } from "../shared/formatted-string/FormattedString";

export const SenseCategoriesAndDefinition = ({
  definition,
  type,
  pos,
  category,
  patternInfo,
  regionInfo,
}: {
  definition: string;
  type: string;
  pos: string;
  category: string;
  patternInfo?: PatternType[] | undefined;
  regionInfo?: RegionInfoType[] | undefined;
}) => {
  return (
    <>
      {pos && <span className="text-[color:--accent-4]">「{pos}」 </span>}
      {type && <span className="text-[color:--accent-5]">「{type}」 </span>}
      {category && (
        <span className="text-[color:--accent-9]">「{category}」 </span>
      )}
      {patternInfo?.map((pattern, id) => (
        <span key={id} className="text-[color:--accent-6]">
          ≪{pattern.pattern}≫{" "}
        </span>
      ))}
      <StringWithNLPAndHanja string={definition} />
      {regionInfo && (
        <span>
          {" ("}
          {regionInfo.map((region, id, regionArray) => (
            <span key={id}>
              {region.region}
              {id + 1 < regionArray.length && ", "}
            </span>
          ))}
          {")."}
        </span>
      )}
    </>
  );
};
