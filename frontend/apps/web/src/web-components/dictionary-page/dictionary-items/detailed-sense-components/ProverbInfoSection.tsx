import { PanelSpecificDispatcher } from "../../panel/PanelSpecificDispatcher.js";
import { StringWithNLPAndHanja } from "../../../other/string-formatters/StringWithNLP.js";
import { ProverbInfoType } from "@repo/shared/types/dictionaryItemProps.js";

export const ProverbInfoSection = ({
  proverbInfo,
}: {
  proverbInfo: ProverbInfoType;
}) => {
  return (
    <ul>
      {proverbInfo.map((proverb, id) => (
        <li style={{ marginTop: "5px", marginBottom: "15px" }} key={id}>
          <SenseProverb proverb={proverb} />
        </li>
      ))}
    </ul>
  );
};

const SenseProverb = ({ proverb }) => {
  return (
    <>
      <div style={{ paddingBottom: "5px" }}>
        <span style={{ color: "#8e44ad" }}>{proverb.type}</span>{" "}
        <PanelSpecificDispatcher
          panelStateAction={{
            type: "push_korean_detail",
            target_code: proverb.link_target_code,
          }}
        >
          {proverb.word}
        </PanelSpecificDispatcher>
      </div>
      <div style={{ position: "relative", left: "10px" }}>
        <StringWithNLPAndHanja string={proverb.definition} />
      </div>
    </>
  );
};
