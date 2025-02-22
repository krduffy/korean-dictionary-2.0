import { TopLevelHideableDropdownNoTruncation } from "../../../shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { HeadwordDerivedExamplesView } from "../../../../../dictionary-items/api-fetchers/HeadwordDerivedExamplesView";

export const DerivedLemmaExamplesArea = ({
  droppedDown,
  headwordPk,
  pageNum,
}: {
  droppedDown: boolean;
  headwordPk: number;
  pageNum: number;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newIsDroppedDown: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_interaction_data",
      key: "derivedLemmasDroppedDown",
      newValue: newIsDroppedDown,
    });
  };

  return (
    <TopLevelHideableDropdownNoTruncation
      title="추가한 맥락에서의 예문"
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <HeadwordDerivedExamplesView headwordPk={headwordPk} pageNum={pageNum} />
    </TopLevelHideableDropdownNoTruncation>
  );
};
