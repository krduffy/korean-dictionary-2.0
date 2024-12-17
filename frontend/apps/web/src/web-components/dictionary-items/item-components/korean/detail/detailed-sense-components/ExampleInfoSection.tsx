import { ExampleType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import { ExampleStringWithNLPAndHanja } from "../../../shared/formatted-string/FormattedString";
import { Source, Href } from "../../../../../text-formatters/SpanStylers";

export const ExampleInfoSection = ({
  examples,
}: {
  examples: ExampleType[];
}) => {
  return (
    <ul>
      {examples.map((ex, id) => (
        <li key={id}>
          <SenseExample example={ex} />
        </li>
      ))}
    </ul>
  );
};

const SenseExample = ({ example }: { example: ExampleType }) => {
  return (
    <div className="mb-2 flex flex-col">
      <div>
        <ExampleStringWithNLPAndHanja string={example.example} />
      </div>
      <div>
        {example.source && (
          <Source>
            출처:{" "}
            <Href
              urlString={`https://ko.wikipedia.org/w/index.php?search=${example.source}`}
            >
              {example.source}
            </Href>
          </Source>
        )}
      </div>
    </div>
  );
};
