import { StringWithNLPAndHanja } from "../../../../other/string-formatters/StringWithNLP";
import { ExampleInfoSection } from "./detailed-sense-components/ExampleInfoSection";
import { TruncatorDropdown } from "../../../../other/misc/TruncatorDropdown";
import { useRef } from "react";
import { useViewDispatchersContext } from "../../../../../web-contexts/ViewDispatchersContext";
import { GrammarInfoSection } from "./detailed-sense-components/GrammarInfoSection";
import { NormInfoSection } from "./detailed-sense-components/NormInfoSection";
import { RelationInfoSection } from "./detailed-sense-components/RelationInfoSection";
import { ProverbInfoSection } from "./detailed-sense-components/ProverbInfoSection";
import { DetailedSectionBox } from "./detailed-sense-components/DetailedSectionBox";
import {
  DetailedSenseType,
  PatternType,
  RegionInfoType,
  SenseAdditionalInfoType,
} from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";

export const DetailedSenseView = ({
  senseData,
  dropdownState,
}: {
  senseData: DetailedSenseType;
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
    <div className="flex flex-row gap-1" ref={mainSenseRef}>
      <div>{senseData.order}.</div>

      <div className="flex-1">
        <div className="pb-4">
          <SenseMainInfo
            definition={senseData.definition}
            type={senseData.type}
            pos={senseData.pos}
            category={senseData.category}
            patternInfo={senseData.additional_info.pattern_info}
            regionInfo={senseData.additional_info.region_info}
          />
        </div>

        {/* ADDITIONAL INFO SECTION (in dropdown because it can be long) */}
        <TruncatorDropdown
          maxHeight={100}
          initialDropdownState={dropdownState}
          overrideScrollbackRef={mainSenseRef}
          onDropdownStateToggle={getOnDropdownStateToggleFunction(
            senseData.order - 1
          )}
        >
          <SenseAdditionalInfo additionalInfoData={senseData.additional_info} />
        </TruncatorDropdown>
      </div>
    </div>
  );
};

const SenseMainInfo = ({
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
  patternInfo: PatternType[] | undefined;
  regionInfo: RegionInfoType[] | undefined;
}) => {
  return (
    <div>
      {category && (
        <span className="text-[color:--accent-3]">「{category}」 </span>
      )}
      {type && <span className="text-[color:--accent-4]">「{type}」 </span>}
      {pos && <span className="text-[color:--accent-5]">「{pos}」 </span>}
      {patternInfo?.map((pattern, id) => (
        <span key={id} className="text-[color:--accent-6]">
          ≪{pattern.pattern}≫{" "}
        </span>
      ))}
      <StringWithNLPAndHanja string={definition} />
      {regionInfo && (
        <span>
          {"("}
          {regionInfo.map((region, id, regionArray) => (
            <span key={id}>
              {region.region}
              {id + 1 < regionArray.length && ", "}
            </span>
          ))}
          {")"}
        </span>
      )}
    </div>
  );
};

const SenseAdditionalInfo = ({
  additionalInfoData,
}: {
  additionalInfoData: SenseAdditionalInfoType;
}) => {
  return (
    <div className="w-full">
      {additionalInfoData.example_info && (
        <div className="pad-10">
          <ExampleInfoSection examples={additionalInfoData.example_info} />
        </div>
      )}
      {additionalInfoData.grammar_info && (
        <DetailedSectionBox title="문법 정보">
          <GrammarInfoSection grammarItems={additionalInfoData.grammar_info} />
        </DetailedSectionBox>
      )}
      {additionalInfoData.norm_info && (
        <DetailedSectionBox title="규범 정보">
          <NormInfoSection norms={additionalInfoData.norm_info} />
        </DetailedSectionBox>
      )}
      {additionalInfoData.relation_info && (
        <DetailedSectionBox title="관련 어휘">
          <RelationInfoSection relations={additionalInfoData.relation_info} />
        </DetailedSectionBox>
      )}
      {additionalInfoData.proverb_info && (
        <DetailedSectionBox title="관용구 • 속담">
          <ProverbInfoSection proverbs={additionalInfoData.proverb_info} />
        </DetailedSectionBox>
      )}
    </div>
  );
};
