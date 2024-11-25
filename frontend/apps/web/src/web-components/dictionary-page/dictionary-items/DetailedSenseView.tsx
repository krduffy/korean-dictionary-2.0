import {
  DetailedSenseType,
  PatternType,
  RegionInfoType,
  SenseAdditionalInfoType,
} from "@repo/shared/types/dictionaryItemProps";
import { StringWithNLPAndHanja } from "../../other/string-formatters/StringWithNLP";
import { ExampleInfoSection } from "./detailed-sense-components/ExampleInfoSection";
import { TruncatorDropdown } from "../../other/misc/TruncatorDropdown";
import { useRef } from "react";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { GrammarInfoSection } from "./detailed-sense-components/GrammarInfoSection";
import { NormInfoSection } from "./detailed-sense-components/NormInfoSection";
import { RelationInfoSection } from "./detailed-sense-components/RelationInfoSection";
import { ProverbInfoSection } from "./detailed-sense-components/ProverbInfoSection";

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
    <div ref={mainSenseRef}>
      <SenseMainInfo
        order={senseData.order}
        definition={senseData.definition}
        type={senseData.type}
        pos={senseData.pos}
        category={senseData.category}
        patternInfo={senseData.additional_info.pattern_info}
        regionInfo={senseData.additional_info.region_info}
      />

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
  );
};

const SenseMainInfo = ({
  order,
  definition,
  type,
  pos,
  category,
  patternInfo,
  regionInfo,
}: {
  order: number;
  definition: string;
  type: string;
  pos: string;
  category: string;
  patternInfo: PatternType[] | undefined;
  regionInfo: RegionInfoType[] | undefined;
}) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <span>{order}. </span>
      <span style={{ color: "#5c68bd" }}>「{type}」</span>
      <span style={{ color: "#8e44ad" }}>「{pos}」</span>
      <span style={{ color: "#3498db" }}>「{category}」</span>
      {patternInfo?.map((pattern, id) => (
        <span key={id} style={{ color: "#42d1f5" }}>
          ≪{pattern.pattern}≫{" "}
        </span>
      ))}
      <StringWithNLPAndHanja string={definition} />
      {regionInfo && (
        <span>
          {"("}
          {regionInfo.map((region, id, regionArray) => (
            <span key={id}>
              {region["region"]}
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
        <div className="curved-box-nest2 tbmargin-10">
          <div className="curved-box-header-nest2">문법 정보</div>
          <div className="pad-10">
            <GrammarInfoSection
              grammarItems={additionalInfoData.grammar_info}
            />
          </div>
        </div>
      )}
      {additionalInfoData.norm_info && (
        <div className="curved-box-nest2 tbmargin-10">
          <div className="curved-box-header-nest2">규범 정보</div>
          <div className="pad-10">
            <NormInfoSection norms={additionalInfoData.norm_info} />
          </div>
        </div>
      )}
      {additionalInfoData.relation_info && (
        <div className="curved-box-nest2 tbmargin-10">
          <div className="curved-box-header-nest2">관련 어휘</div>
          <div className="pad-10">
            <RelationInfoSection relations={additionalInfoData.relation_info} />
          </div>
        </div>
      )}
      {additionalInfoData.proverb_info && (
        <div className="curved-box-nest2 tbmargin-10">
          <div className="curved-box-header-nest2">관용구·속담</div>
          <div className="pad-10">
            <ProverbInfoSection proverbs={additionalInfoData.proverb_info} />
          </div>
        </div>
      )}
    </div>
  );
};
