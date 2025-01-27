import { KoreanHeadwordInExampleType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { KoreanHeadwordKnownStudiedTogglers } from "../../shared/known-studied/KnownStudiedDisplayers";
import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { StringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import {
  DetailViewLinkStyler,
  Href,
  Source,
} from "../../../../text-formatters/SpanStylers";
import { ResultRankingStars } from "../../shared/ResultRankingStars";

export const HanjaExampleKoreanHeadword = ({
  result,
}: {
  result: KoreanHeadwordInExampleType;
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between pb-3">
        <div className="flex flex-row gap-4 items-center">
          <div className="text-[180%] text-[color:--accent-1]">
            <StringWithHanja string={result.origin} />
          </div>
          <div className="text-[120%]">
            <PanelSpecificDispatcher
              panelStateAction={{
                type: "push_korean_detail",
                target_code: result.target_code,
              }}
            >
              <DetailViewLinkStyler>{result.word}</DetailViewLinkStyler>
            </PanelSpecificDispatcher>
          </div>
          <div className="flex justify-center items-center">
            <ResultRankingStars
              numStars={result.result_ranking}
              widthAndHeightPx={24}
            />
          </div>
        </div>
        {result.user_data && (
          <KoreanHeadwordKnownStudiedTogglers
            pk={result.target_code}
            isKnown={result.user_data.is_known}
            isStudied={result.user_data.is_studied}
          />
        )}
      </div>

      <div>
        <StringWithNLPAndHanja string={result.first_sense.definition} />

        <br />

        <HanjaExampleKoreanHeadwordSource origin={result.origin} />
      </div>
    </>
  );
};

const HanjaExampleKoreanHeadwordSource = ({ origin }: { origin: string }) => {
  return (
    <footer>
      <Source>
        출처:{" "}
        <Href
          urlString={`https://opendict.korean.go.kr/search/searchResult?query=${origin}`}
        >
          우리말샘
        </Href>
      </Source>
    </footer>
  );
};
