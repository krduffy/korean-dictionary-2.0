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
    <article className="flex flex-col min-h-32 min-w-56 bg-[color:--background-tertiary] border-2 border-[color:--border-color]">
      <header className="h-[20%] w-full bg-[color:--surface-color] p-2">
        <HanjaPopupHeaderContents
          character={data.character}
          meaningReadings={data.meaning_readings}
          userData={data.user_data}
        />
      </header>
      <section className="flex-1 w-full p-2">
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
    <div className="h-full w-full flex flex-row justify-between items-center">
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
    <div className="flex flex-row gap-2 justify-evenly">
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
    <div className="flex flex-col gap-2">
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
    <article className="flex flex-row gap-2">
      <p>{data.origin}</p>
      <p>{data.word}</p>
    </article>
  );
};
