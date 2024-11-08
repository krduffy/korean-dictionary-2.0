import {
  DetailedSenseType,
  SenseAdditionalInfoType,
} from "@repo/shared/types/dictionaryItemProps";
import { StringWithNLPAndHanja } from "../string-formatters/StringWithNLP";
import { ExampleInfoSection } from "./detailed-sense-components/ExampleInfoSection";
import { TruncatorDropdown } from "app/web-components/misc/TruncatorDropdown";
import { useRef } from "react";

export const DetailedSenseView = ({ data }: { data: DetailedSenseType }) => {
  const mainSenseRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainSenseRef}>
      <span>{data.order}. </span>
      <span className="text-[color:--accent-3]">{data.category} </span>
      <span className="text-[color:--accent-4]">{data.type} </span>
      <span className="text-[color:--accent-5]">{data.pos} </span>
      <StringWithNLPAndHanja string={data.definition} />

      <TruncatorDropdown maxHeight={100} overrideScrollbackRef={mainSenseRef}>
        <SenseAdditionalInfo data={data.additional_info} />
      </TruncatorDropdown>
    </div>
  );
};

const SenseAdditionalInfo = ({ data }: { data: SenseAdditionalInfoType }) => {
  return (
    data.example_info && <ExampleInfoSection exampleInfo={data.example_info} />
  );
};
