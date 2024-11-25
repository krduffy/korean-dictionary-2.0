import { PanelSpecificDispatcher } from "../../panel/PanelSpecificDispatcher";
import { StringWithNLPAndHanja } from "../../../other/string-formatters/StringWithNLP";
import { ProverbType } from "@repo/shared/types/dictionaryItemProps";

export const ProverbInfoSection = ({
  proverbs,
}: {
  proverbs: ProverbType[];
}) => {
  return (
    <ul>
      {proverbs.map((proverb, id) => (
        <li style={{ marginTop: "5px", marginBottom: "15px" }} key={id}>
          <SenseProverb proverb={proverb} />
        </li>
      ))}
    </ul>
  );
};

const SenseProverb = ({ proverb }: { proverb: ProverbType }) => {
  return (
    <>
      <div style={{ paddingBottom: "5px" }}>
        <span style={{ color: "#8e44ad" }}>{proverb.type}</span>{" "}
        {proverb.link_target_code ? (
          <PanelSpecificDispatcher
            panelStateAction={{
              type: "push_korean_detail",
              target_code: proverb.link_target_code,
            }}
          >
            {proverb.word}
          </PanelSpecificDispatcher>
        ) : (
          <span>{proverb.word}</span>
        )}
      </div>
      <div style={{}}>
        <StringWithNLPAndHanja string={proverb.definition} />
      </div>
    </>
  );
};
