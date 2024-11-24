import { ExampleType } from "@repo/shared/types/dictionaryItemProps";
import { ExampleStringWithNLPAndHanja } from "../../../other/string-formatters/StringWithNLP";

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

const SenseExample = ({ example }: { example: ExampleType }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <ExampleStringWithNLPAndHanja string={example["example"]} />

      {example["source"] && <span>출처: {example["source"]}</span>}
    </div>
  );
};
