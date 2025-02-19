import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";

export const ListedVideoComponent = ({
  data,
  changeField,
}: {
  data: Omit<UserVideoExampleType, "id">;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
}) => {
  return (
    <div>
      {data.video_id}
      {data.source}
      {/* @ts-ignore */}
      {data.id || "no id"}
    </div>
  );
};
