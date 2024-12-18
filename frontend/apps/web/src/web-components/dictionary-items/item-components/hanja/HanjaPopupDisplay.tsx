import {
  HanjaPopupType,
  KoreanWordInHanjaPopupType,
  MeaningReadings,
} from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { UserDataType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { MeaningReadingsDisplay } from "./MeaningReadingsDisplay";
import { FunctionlessKnownStudiedDisplayers } from "../shared/known-studied/KnownStudiedDisplayers";

export const HanjaPopupDisplay = ({ data }: { data: HanjaPopupType }) => {
  return (
    <article className="min-h-16 min-w-16 p-4 bg-[color:--background-tertiary] border-2 border-[color:--border-color]">
      <header className="h-[20%] w-full">
        <HanjaPopupHeaderContents
          character={data.character}
          meaningReadings={data.meaning_readings}
          userData={data.user_data}
        />
      </header>
      <section>
        {data.word_results.length === 0 ? (
          <HanjaPopupWordGridNoWords />
        ) : (
          <HanjaPopupWordGrid wordData={data.word_results} />
        )}
      </section>
    </article>
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
    <div className="h-full w-full flex flex-row justify-between">
      <h1 className="text-[color:--accent-1]">{character}</h1>
      <MeaningReadingsDisplay meaningReadings={meaningReadings} />
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
  return <div>no words</div>;
};

const HanjaPopupWordGrid = ({
  wordData,
}: {
  wordData: KoreanWordInHanjaPopupType[];
}) => {
  const col1Words = wordData.slice(0, Math.ceil(wordData.length / 2));
  const col2Words = wordData.slice(col1Words.length);

  return (
    <div className="flex flex-row">
      <HanjaPopupWordGridColumn wordDataSubarray={col1Words} />
      <HanjaPopupWordGridColumn wordDataSubarray={col2Words} />
    </div>
  );
};

const HanjaPopupWordGridColumn = ({
  wordDataSubarray,
}: {
  wordDataSubarray: KoreanWordInHanjaPopupType[];
}) => {
  return (
    <div>
      {wordDataSubarray.map((wordData) => (
        <HanjaPopupWordGridSingleWord
          key={wordData.target_code}
          data={wordData}
        />
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
    <div>
      <span>
        {data.origin} {data.word}
      </span>
      {data.user_data && (
        <FunctionlessKnownStudiedDisplayers
          known={data.user_data.is_known}
          studied={data.user_data.is_studied}
        />
      )}
    </div>
  );
};
