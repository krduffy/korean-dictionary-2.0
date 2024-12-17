import { GrammarItemType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";

export const GrammarInfoSection = ({
  grammarItems,
}: {
  grammarItems: GrammarItemType[];
}) => {
  return (
    <ul>
      {grammarItems.map((grammarItem, id) => (
        <li key={id} style={{ paddingLeft: "5px" }}>
          <span>{grammarItem.grammar}</span>
        </li>
      ))}
    </ul>
  );
};
