import { DerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";

export const ListedDerivedExampleText = ({
  result,
}: {
  result: DerivedExampleTextType;
}) => {
  return (
    <div>
      {result.source}
      {result.id}
    </div>
  );
};
