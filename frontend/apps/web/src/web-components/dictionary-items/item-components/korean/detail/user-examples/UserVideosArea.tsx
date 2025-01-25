import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { BasicNestedHideableDropdownNoTruncation } from "../../../shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const UserVideoExamplesArea = ({
  droppedDown,
  allUserVideoExamplesData,
}: {
  droppedDown: boolean;
  allUserVideoExamplesData: UserVideoExampleType[];
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newIsDroppedDown: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_user_example_interaction_data",
      key: "videosDroppedDown",
      newValue: newIsDroppedDown,
    });
  };

  return (
    <BasicNestedHideableDropdownNoTruncation
      title="영상"
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <ListedUserVideoExamples
        allUserVideoExamplesData={allUserVideoExamplesData}
      />
    </BasicNestedHideableDropdownNoTruncation>
  );
};

const ListedUserVideoExamples = ({
  allUserVideoExamplesData,
}: {
  allUserVideoExamplesData: UserVideoExampleType[];
}) => {
  return (
    <ul
      className="w-full flex flex-col gap-4"
      aria-label="user-video-examples-list"
    >
      {allUserVideoExamplesData.map((userVideoExampleData, index) => (
        <UserVideoExample
          key={index}
          userVideoExampleData={userVideoExampleData}
        />
      ))}
    </ul>
  );
};

const UserVideoExample = ({
  userVideoExampleData,
}: {
  userVideoExampleData: UserVideoExampleType;
}) => {
  return (
    <article className="w-full flex flex-row justify-between items-center">
      <button></button>
      <UserVideoExampleIframe
        videoId={userVideoExampleData.video_id}
        start={userVideoExampleData.start}
        end={userVideoExampleData.end}
      />
      <button></button>
    </article>
  );
};

const UserVideoExampleIframe = ({
  videoId,
  start,
  end,
}: {
  videoId: string;
  start: number;
  end: number;
}) => {
  const src = `https://youtube.com/embed/${videoId}?start=${start}&end=${end}&hl=ko`;

  return (
    <iframe className="max-w-screen-sm w-full aspect-video" src={src}></iframe>
  );
};
