import { StringWithNLPAndHanja } from "../../../../other/string-formatters/StringWithNLP";
import { ExampleInfoSection } from "./detailed-sense-components/ExampleInfoSection";
import { TruncatorDropdown } from "../../../../other/misc/TruncatorDropdown";
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
import {
  DetailViewBaseDefaultHideableDropdownNoTruncation,
  HideableDropdownNoTruncation,
} from "../../ReusedFormatters";
import { data } from "autoprefixer";

export const DetailedSenseView = ({
  senseData,
  dropdownState,
}: {
  senseData: DetailedSenseType;
  dropdownState: DetailedSenseDropdownState;
}) => {
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

  const title = (
    <div className="flex flex-row gap-1 py-1 pr-8">
      <div>{senseData.order}.</div>

      <div className="flex-1">
        <SenseMainInfo
          definition={senseData.definition}
          type={senseData.type}
          pos={senseData.pos}
          category={senseData.category}
          patternInfo={senseData.additional_info.pattern_info}
          regionInfo={senseData.additional_info.region_info}
        />
      </div>
    </div>
  );

  const hasAdditionalInfo = [
    senseData.additional_info.example_info,
    senseData.additional_info.grammar_info,
    senseData.additional_info.norm_info,
    senseData.additional_info.proverb_info,
    senseData.additional_info.relation_info,
  ].some((info) => info !== undefined);

  return (
    <HideableDropdownNoTruncation
      /* if there is no additional info then the dropdown is disabled
         to prevent droppable div with just padding */
      disableDropdown={!hasAdditionalInfo}
      droppedDown={dropdownState.additionalInfoBoxDroppedDown}
      classes={{
        topBarClassName: "bg-[color:--neutral-color-not-hovering] py-2",
        childrenClassName: "bg-[color:--background-tertiary]",
      }}
      onDropdownStateToggle={getOnDropdownStateToggleFunction(senseData.order)(
        "additionalInfoBoxDroppedDown"
      )}
      title={title}
    >
      <div className="p-4">
        <SenseAdditionalInfo
          getOnDropdownStateToggleFunction={getOnDropdownStateToggleFunction(
            senseData.order
          )}
          dropdownState={dropdownState}
          additionalInfoData={senseData.additional_info}
        />
      </div>
    </HideableDropdownNoTruncation>
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

      <NonExampleInfoAdditionalInfo
        getOnDropdownStateToggleFunction={getOnDropdownStateToggleFunction}
        dropdownState={dropdownState}
        additionalInfoData={additionalInfoData}
      />
    </div>
  );
};

const NonExampleInfoAdditionalInfo = ({
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
    <div className="flex flex-col gap-4">
      {/* Individual info items (grammar, etc) */}

      {additionalInfoItems.map(
        ({ name, title, getComponent }, id) =>
          additionalInfoData[`${name}_info`] && (
            <DetailViewBaseDefaultHideableDropdownNoTruncation
              key={title}
              droppedDown={dropdownState[`${name}InfoDroppedDown`]}
              onDropdownStateToggle={getOnDropdownStateToggleFunction(
                `${name}InfoDroppedDown`
              )}
              title={title}
            >
              {
                /* Easier to just disable; the array is const and it works */
                // @ts-ignore
                getComponent(additionalInfoData[`${name}_info`])
              }
            </DetailViewBaseDefaultHideableDropdownNoTruncation>
          )
      )}
    </div>
  );
};
