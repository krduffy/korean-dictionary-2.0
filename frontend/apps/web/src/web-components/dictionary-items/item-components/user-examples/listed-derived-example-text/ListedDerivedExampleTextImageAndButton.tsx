import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { TextSearch } from "lucide-react";

export const ListedDerivedExampleTextImageAndButton = ({
  imageUrl,
  sourceTextPk,
}: {
  imageUrl: string | null;
  sourceTextPk: number;
}) => {
  if (imageUrl === null) {
    return <GoToSourceTextButton sourceTextPk={sourceTextPk} />;
  }

  return (
    <>
      <div className="flex items-center justify-center w-24 h-48">
        <img className="max-h-full w-full object-contain" src={imageUrl} />
      </div>

      <div className="w-24">
        <GoToSourceTextButton sourceTextPk={sourceTextPk} />
      </div>
    </>
  );
};

const GoToSourceTextButton = ({ sourceTextPk }: { sourceTextPk: number }) => {
  return (
    <button className="w-full flex items-center justify-center">
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_lemma_derived_text_detail",
          sourceTextPk: sourceTextPk,
          highlightEojeolNumOnLoad: null,
        }}
      >
        <TextSearch />
      </PanelSpecificDispatcher>
    </button>
  );
};
