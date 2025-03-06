import { Href, Source } from "../../../../text-formatters/SpanStylers";

export const HanjaDetailTopInfoSources = ({
  radicalSource,
  character,
  hasHanziWriterSource,
}: {
  radicalSource: "나무위키" | "makemeahanzi";
  character: string;
  hasHanziWriterSource: boolean;
}) => {
  const fromNamuwiki = `훈음, ${radicalSource === "나무위키" ? "부수, " : ""}교육용, 급수별, 획수`;
  const fromMakemeahanzi = `${radicalSource === "makemeahanzi" ? "부수, " : ""}모양자 분해`;

  return (
    <footer className="flex flex-row justify-between items-center gap-6">
      <Source>
        <p>
          {fromNamuwiki} 출처:{" "}
          <Href urlString={`https://namu.wiki/w/${character}`}>나무위키</Href>
        </p>
      </Source>
      <Source>
        <p>
          {fromMakemeahanzi} 출처:{" "}
          <Href urlString={`https://github.com/skishore/makemeahanzi`}>
            makemeahanzi
          </Href>
        </p>
      </Source>
      {hasHanziWriterSource && (
        <Source>
          <p className="text-center">
            한자 획순 재생기 출처:{" "}
            <Href urlString="https://hanziwriter.org/">hanziwriter</Href>
          </p>
        </Source>
      )}
    </footer>
  );
};
