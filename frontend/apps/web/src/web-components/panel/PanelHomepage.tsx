import { PanelHomepageInteractionData } from "@repo/shared/types/views/interactionDataTypes";

export const PanelHomepage = ({
  interactionData,
}: {
  interactionData: PanelHomepageInteractionData;
}) => {
  return (
    <div className="flex justify-center items-center min-h-48 w-full">
      홈페이지
    </div>
  );
};
