import {
  HanjaPopupType,
  KoreanWordInHanjaPopupType,
  MeaningReadings,
} from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { UserDataType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { MeaningReadingsDisplay } from "./MeaningReadingsDisplay";
import { FunctionlessKnownStudiedDisplayers } from "../shared/known-studied/KnownStudiedDisplayers";
import { Source } from "../../../text-formatters/SpanStylers";

export const HanjaPopupDisplay = ({ data }: { data: HanjaPopupType }) => {
  return (
    <article className="flex flex-col h-full w-full">
      <HanjaPopupTopInfo data={data} />
      <HanjaPopupBottomInfo wordResults={data.word_results} />
    </article>
  );
};

const HanjaPopupTopInfo = ({ data }: { data: HanjaPopupType }) => {
  return (
    <header
      className="w-full bg-[color:--surface-color] p-2
                  rounded-t-xl border-x-2 border-t-2 border-[color:--accent-border-color]"
    >
      <HanjaPopupHeaderContents
        character={data.character}
        meaningReadings={data.meaning_readings}
        userData={data.user_data}
      />
    </header>
  );
};

const HanjaPopupBottomInfo = ({
  wordResults,
}: {
  wordResults: KoreanWordInHanjaPopupType[];
}) => {
  return (
    <section
      className="flex-1 w-full p-2 bg-[color:--background-tertiary]
                  rounded-b-xl border-x-2 border-b-2 border-[color:--accent-border-color]"
    >
      {wordResults.length === 0 ? (
        <HanjaPopupWordGridNoWords />
      ) : (
        <HanjaPopupWordGrid wordData={wordResults} />
      )}
      <br />
      <HanjaPopupSource />
    </section>
  );
};

const HanjaPopupSource = () => {
  return (
    <footer className="flex items-center justify-center">
      <Source>
        <p className="pb-1">한자 훈음 출처: 나무위키</p>
        <p>한자 용례 출처: 우리말샘</p>
      </Source>
    </footer>
  );
};

const HanjaPopupHeaderContents = ({
  character,
  meaningReadings,
  userData,
}: {
  character: string;
  meaningReadings: MeaningReadings[];
  userData: UserDataType | null;
}) => {
  return (
    <div
      className={`w-full flex flex-row items-center
                    ${userData === null ? "justify-center" : "justify-between"}`}
    >
      <div className="flex flex-row gap-2 items-center">
        <h3 className="text-[color:--accent-1] text-[200%] left-2">
          {character}
        </h3>
        <h4 className="text-[120%]">
          <MeaningReadingsDisplay meaningReadings={meaningReadings} />
        </h4>
      </div>
      {userData && (
        <FunctionlessKnownStudiedDisplayers
          known={userData.is_known}
          studied={userData.is_studied}
        />
      )}
    </div>
  );
};

const HanjaPopupWordGridNoWords = () => {
  return (
    <div className="flex justify-center items-center">
      이 한자는 용례가 없습니다.
    </div>
  );
};

const HanjaPopupWordGrid = ({
  wordData,
}: {
  wordData: KoreanWordInHanjaPopupType[];
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 auto-rows-min w-full">
      {wordData.map((data) => (
        <HanjaPopupWordGridSingleWord key={data.target_code} data={data} />
      ))}
    </div>
  );
};

const HanjaPopupWordGridSingleWord = ({
  data,
}: {
  data: KoreanWordInHanjaPopupType;
}) => {
  return (
    <article className="flex flex-row gap-2 text-nowrap justify-center items-center">
      <p>{data.origin}</p>
      <p>{data.word}</p>
    </article>
  );
};
