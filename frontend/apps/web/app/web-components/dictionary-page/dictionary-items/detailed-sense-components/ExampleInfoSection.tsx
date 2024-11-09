import { ExampleType } from "@repo/shared/types/dictionaryItemProps";
import { Source } from "../../string-formatters/Source";
import { ExampleStringWithNLPAndHanja } from "../../string-formatters/StringWithNLP";

export const ExampleInfoSection = ({
  exampleInfo,
}: {
  exampleInfo: ExampleType[];
}) => {
  return (
    <ul>
      {exampleInfo.map((ex, id) => (
        <li key={id}>
          <SenseExample example={ex} />
        </li>
      ))}
    </ul>
  );
};

const SenseExample = ({ example }: { example: Example }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <ExampleStringWithNLPAndHanja string={example["example"]} />

      {example["source"] && (
        <Source>
          <span>출처: {example["source"]}</span>
        </Source>
      )}
    </div>
  );
};