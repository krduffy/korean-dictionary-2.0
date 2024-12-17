import { HanjaPopupType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";

export const HanjaPopupDisplay = ({ data }: { data: HanjaPopupType }) => {
  return <div>{data.character}</div>;
};
