import { StringWithNLPAndHanja } from "../../../../other/string-formatters/StringWithNLP";
import { ExampleInfoSection } from "./detailed-sense-components/ExampleInfoSection";
import { TruncatorDropdown } from "../../../../other/misc/TruncatorDropdown";
import { ReactNode, useRef } from "react";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { GrammarInfoSection } from "./detailed-sense-components/GrammarInfoSection";
import { NormInfoSection } from "./detailed-sense-components/NormInfoSection";
import { RelationInfoSection } from "./detailed-sense-components/RelationInfoSection";
import { ProverbInfoSection } from "./detailed-sense-components/ProverbInfoSection";
import {
  DetailedSenseType,
  GrammarItemType,
  NormType,
  PatternType,
  ProverbType,
  RegionInfoType,
  RelationType,
  SenseAdditionalInfoType,
} from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import { DetailedSenseDropdownState } from "@repo/shared/types/views/interactionDataTypes";
import { HideableDropdownNoTruncation } from "../../ReusedFormatters";

export const DetailedSenseView = ({
  senseData,
  dropdownState,
}: {
  senseData: DetailedSenseType;
  dropdownState: DetailedSenseDropdownState;
}) => {
  const mainSenseRef = useRef<HTMLDivElement>(null);

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const getOnDropdownStateToggleFunction = (order: number) => {
    return (dropdownKey: keyof DetailedSenseDropdownState) => {
      return (isExpanded: boolean) => {
        panelDispatchStateChangeSelf({
          type: "update_korean_detail_dropdown_toggle",
          senseNumber: order - 1,
          dropdownKey: dropdownKey,
          newIsDroppedDown: isExpanded,
        });
      };
    };
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

        <SenseAdditionalInfo
          getOnDropdownStateToggleFunction={getOnDropdownStateToggleFunction(
            senseData.order
          )}
          dropdownState={dropdownState}
          additionalInfoData={senseData.additional_info}
        />
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

/* Examples are put in their own area. */

const SenseAdditionalInfo = ({
  getOnDropdownStateToggleFunction,
  dropdownState,
  additionalInfoData,
}: {
  getOnDropdownStateToggleFunction: (
    dropdownKey: keyof DetailedSenseDropdownState
  ) => (isExpanded: boolean) => void;
  dropdownState: DetailedSenseDropdownState;
  additionalInfoData: SenseAdditionalInfoType;
}) => {
  const showOtherBox: boolean =
    additionalInfoData.grammar_info !== undefined ||
    additionalInfoData.norm_info !== undefined ||
    additionalInfoData.relation_info !== undefined ||
    additionalInfoData.proverb_info !== undefined;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* EXAMPLES */}
      {additionalInfoData.example_info && (
        <TruncatorDropdown
          maxHeight={100}
          droppedDown={dropdownState.exampleInfoDroppedDown}
          onDropdownStateToggle={getOnDropdownStateToggleFunction(
            "exampleInfoDroppedDown"
          )}
        >
          <div className="pad-10">
            <ExampleInfoSection examples={additionalInfoData.example_info} />
          </div>
        </TruncatorDropdown>
      )}

      {showOtherBox && (
        <AdditionalInfoOtherBox
          getOnDropdownStateToggleFunction={getOnDropdownStateToggleFunction}
          dropdownState={dropdownState}
          additionalInfoData={additionalInfoData}
        />
      )}
    </div>
  );
};

const AdditionalInfoOtherBox = ({
  getOnDropdownStateToggleFunction,
  dropdownState,
  additionalInfoData,
}: {
  getOnDropdownStateToggleFunction: (
    dropdownKey: keyof DetailedSenseDropdownState
  ) => (isExpanded: boolean) => void;
  dropdownState: DetailedSenseDropdownState;
  additionalInfoData: SenseAdditionalInfoType;
}) => {
  /* excludes examples */
  const additionalInfoItems = [
    {
      name: "relation",
      title: "관련 어휘",
      getComponent: (relation_info: RelationType[]) => (
        <RelationInfoSection relations={relation_info} />
      ),
    },
    {
      name: "proverb",
      title: "관용구 • 속담",
      getComponent: (proverb_info: ProverbType[]) => (
        <ProverbInfoSection proverbs={proverb_info} />
      ),
    },
    {
      name: "norm",
      title: "규범 정보",
      getComponent: (norm_info: NormType[]) => (
        <NormInfoSection norms={norm_info} />
      ),
    },
    {
      name: "grammar",
      title: "문법 정보",
      getComponent: (grammar_info: GrammarItemType[]) => (
        <GrammarInfoSection grammarItems={grammar_info} />
      ),
    },
  ] as const;

  return (
    <HideableDropdownNoTruncation
      droppedDown={dropdownState.otherInfoBoxDroppedDown}
      topBarColor="var(--surface-color)"
      childrenBackgroundColor="var(--background-tertiary)"
      onDropdownStateToggle={getOnDropdownStateToggleFunction(
        "otherInfoBoxDroppedDown"
      )}
      title="정보"
    >
      <div className="flex flex-col p-4 gap-4">
        {/* Individual info items (grammar, etc) */}

        {additionalInfoItems.map(
          ({ name, title, getComponent }, id) =>
            additionalInfoData[`${name}_info`] && (
              <HideableDropdownNoTruncation
                key={title}
                droppedDown={dropdownState[`${name}InfoDroppedDown`]}
                topBarColor={`var(--accent-${id + 1})`}
                childrenBackgroundColor="var(--background-quaternary)"
                onDropdownStateToggle={getOnDropdownStateToggleFunction(
                  `${name}InfoDroppedDown`
                )}
                title={title}
              >
                <div>
                  {
                    /* Easier to just disable; the array is const and it works */
                    // @ts-ignore
                    getComponent(additionalInfoData[`${name}_info`])
                  }
                </div>
              </HideableDropdownNoTruncation>
            )
        )}
      </div>
    </HideableDropdownNoTruncation>
  );
};
