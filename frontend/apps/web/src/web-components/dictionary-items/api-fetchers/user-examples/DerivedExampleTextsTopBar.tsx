import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DerivedExampleTextsSearchBar } from "./DerivedExampleTextsSearchBar";
import { Plus } from "lucide-react";

export const DerivedExampleTextsTopBar = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (newSearchTerm: string) => void;
}) => {
  return (
    <>
      <h1 className="text-center text-[200%] pb-4">추가한 문서</h1>
      <div className="flex flex-row items-center justify-center">
        <div className="flex-1 items-center justify-center">
          <DerivedExampleTextsSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="w-24 h-full flex-none flex justify-center items-center">
          <AddNewTextButton />
        </div>
      </div>
    </>
  );
};

const AddNewTextButton = () => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onClick = () => {};

  return (
    <button
      className="aspect-square h-full rounded-full border-2 p-2
                 flex items-center justify-center
                 bg-[color:--accent-button-color]
                 hover:bg-[color:--accent-button-hover-color]
                 border-[color:--border-color]
                 text-[color:--accent-button-text-color]"
      onClick={onClick}
    >
      <Plus />
    </button>
  );
};
