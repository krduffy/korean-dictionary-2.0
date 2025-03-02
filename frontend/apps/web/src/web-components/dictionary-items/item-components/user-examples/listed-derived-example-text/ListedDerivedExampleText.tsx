import { DerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { ListedDerivedExampleTextImageAndButton } from "./ListedDerivedExampleTextImageAndButton";
import { DeleteTextButton } from "./DeleteTextButton";

export const ListedDerivedExampleText = ({
  result,
  refetchList,
}: {
  result: DerivedExampleTextType;
  refetchList: () => void;
}) => {
  return (
    <article
      className="h-48 mb-2 flex flex-row gap-4"
      aria-label="derived-example-lemma"
    >
      <div className="h-full flex-none w-48 flex flex-row items-center justify-center">
        <ListedDerivedExampleTextImageAndButton
          imageUrl={result.image_url}
          sourceTextPk={result.id}
        />
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <h2 className="w-full text-[150%]">{result.source}</h2>
        <PreviewOfText text={result.text} />
      </div>
      <div className="flex items-center justify-center">
        <DeleteTextButton sourceTextPk={result.id} onDelete={refetchList} />
      </div>
    </article>
  );
};

const PreviewOfText = ({ text }: { text: string }) => {
  return (
    <div
      className="h-48 overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 85%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
      }}
    >
      {text.split(/\n/).map((substr, id) => (
        <p key={id}>{substr}</p>
      ))}
    </div>
  );
};
