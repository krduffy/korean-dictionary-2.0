import { GrammarInfoType } from "@repo/shared/types/dictionaryItemProps";

const SenseGrammarInfo = ({
  grammarInfo,
}: {
  grammarInfo: GrammarInfoType;
}) => {
  return (
    <ul>
      {grammarInfo.map((grammar, id) => (
        <li key={id} style={{ paddingLeft: "5px" }}>
          <span>{grammar.grammar}</span>
        </li>
      ))}
    </ul>
  );
};

export default SenseGrammarInfo;
