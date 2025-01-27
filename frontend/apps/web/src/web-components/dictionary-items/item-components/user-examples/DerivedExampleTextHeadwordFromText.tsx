import { DerivedExampleTextHeadwordFromTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";

export const DerivedExampleTextHeadwordFromText = ({
  result,
}: {
  result: DerivedExampleTextHeadwordFromTextType;
}) => {
  return <div>{result.lemma}</div>;
};
