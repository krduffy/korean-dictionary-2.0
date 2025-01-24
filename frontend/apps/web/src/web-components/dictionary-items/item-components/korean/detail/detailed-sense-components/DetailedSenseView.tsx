import { StringWithNLPAndHanja } from "../../../shared/formatted-string/FormattedString";
import { ExampleInfoSection } from "./ExampleInfoSection";
import { TruncatorDropdown } from "../../../../../ui/TruncatorDropdown";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { GrammarInfoSection } from "./GrammarInfoSection";
import { NormInfoSection } from "./NormInfoSection";
import { RelationInfoSection } from "./RelationInfoSection";
import { ProverbInfoSection } from "./ProverbInfoSection";
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
  BasicNestedHideableDropdownNoTruncation,
  HideableDropdownNoTruncation,
} from "../../../shared/ReusedFormatters";
import { Href, Source } from "../../../../../text-formatters/SpanStylers";
import { SenseCategoriesAndDefinition } from "../../SenseCategoriesAndDefinition";

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
          targetCode={senseData.target_code}
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
      droppedDown={
        dropdownState.additionalInfoBoxDroppedDown && hasAdditionalInfo
      }
      classes={{
        topBarClassName: "bg-[color:--neutral-color-not-hovering] py-2",
        childrenClassName: "bg-[color:--background-tertiary]",
        titleClassName: "w-full",
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
        <br />
        <SourceForSenseNumber targetCode={senseData.target_code} />
      </div>
    </HideableDropdownNoTruncation>
  );
};

const SourceForSenseNumber = ({ targetCode }: { targetCode: number }) => (
  <footer>
    <Source>
      출처:{" "}
      <Href
        urlString={`https://opendict.korean.go.kr/dictionary/view?sense_no=${targetCode}`}
      >
        우리말샘
      </Href>
    </Source>
  </footer>
);

const SenseMainInfo = ({
  targetCode,
  definition,
  type,
  pos,
  category,
  patternInfo,
  regionInfo,
}: {
  targetCode: number;
  definition: string;
  type: string;
  pos: string;
  category: string;
  patternInfo: PatternType[] | undefined;
  regionInfo: RegionInfoType[] | undefined;
}) => {
  return (
    <div>
      <SenseCategoriesAndDefinition
        definition={definition}
        type={type}
        pos={pos}
        category={category}
        patternInfo={patternInfo}
        regionInfo={regionInfo}
      />
      <br />
      <SourceForSenseNumber targetCode={targetCode} />
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
            <BasicNestedHideableDropdownNoTruncation
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
            </BasicNestedHideableDropdownNoTruncation>
          )
      )}
    </div>
  );
};
