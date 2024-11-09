import {
  DetailedSenseType,
  SenseAdditionalInfoType,
} from "@repo/shared/types/dictionaryItemProps";
import { StringWithNLPAndHanja } from "../string-formatters/StringWithNLP";
import { ExampleInfoSection } from "./detailed-sense-components/ExampleInfoSection";
import { TruncatorDropdown } from "app/web-components/misc/TruncatorDropdown";
import { useRef } from "react";
import { useViewDispatchersContext } from "app/web-contexts/ViewDispatchersContext";

export const DetailedSenseView = ({
  data,
  dropdownState,
}: {
  data: DetailedSenseType;
  dropdownState: boolean;
}) => {
  const mainSenseRef = useRef<HTMLDivElement>(null);

  const { dispatch } = useViewDispatchersContext();

  const getOnDropdownStateToggleFunction = (id: number) => {
    return (isExpanded: boolean) =>
      dispatch({
        type: "update_korean_detail_dropdown_toggle",
        id: id,
        newIsDroppedDown: isExpanded,
      });
  };

  return (
    <div ref={mainSenseRef}>
      <span>{data.order}. </span>
      <span className="text-[color:--accent-3]">{data.category} </span>
      <span className="text-[color:--accent-4]">{data.type} </span>
      <span className="text-[color:--accent-5]">{data.pos} </span>
      <StringWithNLPAndHanja string={data.definition} />

      <TruncatorDropdown
        maxHeight={100}
        initialDropdownState={dropdownState}
        overrideScrollbackRef={mainSenseRef}
        onDropdownStateToggle={getOnDropdownStateToggleFunction(data.order - 1)}
      >
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
