import { UserExampleSentenceType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { ExampleStringWithNLPAndHanja } from "../../../shared/formatted-string/FormattedString";
import { Source } from "../../../../../text-formatters/SpanStylers";

export const UserExampleSentencesArea = ({
  allUserExampleSentencesData,
}: {
  allUserExampleSentencesData: UserExampleSentenceType[];
}) => {
  return (
    <ListedUserExampleSentences
      allUserExampleSentencesData={allUserExampleSentencesData}
    ></ListedUserExampleSentences>
  );
};

const ListedUserExampleSentences = ({
  allUserExampleSentencesData,
}: {
  allUserExampleSentencesData: UserExampleSentenceType[];
}) => {
  return (
    <ul>
      {allUserExampleSentencesData.map((userExampleSentenceData, index) => (
        <li key={index}>
          <UserExampleSentence
            userExampleSentenceData={userExampleSentenceData}
          />
        </li>
      ))}
    </ul>
  );
};

const UserExampleSentence = ({
  userExampleSentenceData,
}: {
  userExampleSentenceData: UserExampleSentenceType;
}) => {
  return (
    <article className="mb-2 flex flex-col" aria-label="user-example-sentence">
      <div>
        <ExampleStringWithNLPAndHanja
          string={userExampleSentenceData.sentence}
        />
      </div>
      <div>
        <Source>출처: {userExampleSentenceData.source}</Source>
      </div>
    </article>
  );
};
