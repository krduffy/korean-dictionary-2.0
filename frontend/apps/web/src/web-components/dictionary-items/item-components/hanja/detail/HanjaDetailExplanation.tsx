import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DetailViewBaseDefaultHideableDropdownNoTruncation } from "../../shared/ReusedFormatters";
import { StringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";
import { Href, Source } from "../../../../text-formatters/SpanStylers";

export const HanjaDetailExplanation = ({
  character,
  explanation,
  droppedDown,
}: {
  character: string;
  explanation: string;
  droppedDown: boolean;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newValue: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_detail_interaction_data",
      key: "explanationDroppedDown",
      newValue: newValue,
    });
  };

  return (
    <DetailViewBaseDefaultHideableDropdownNoTruncation
      title="설명"
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <StringWithNLPAndHanja string={explanation} />
      <div className="h-1" />
      <HanjaExplanationSource character={character} />
    </DetailViewBaseDefaultHideableDropdownNoTruncation>
  );
};

const HanjaExplanationSource = ({ character }: { character: string }) => {
  return (
    <footer>
      <Source>
        출처:{" "}
        <Href urlString={`https://namu.wiki/w/${character}`}>나무위키</Href>
      </Source>
    </footer>
  );
};
