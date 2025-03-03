import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";
import { TextAreaInput } from "../../../../forms/input-components/TextAreaInput";

export const VideoIdInput = ({
  videoId,
  changeField,
}: {
  videoId: string;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
}) => {
  /* The video id input allows the user to paste a typical youtube url 
     into the video id input box and automatically replace it with only 
     the video id from that url. */

  const getVideoIdFromUrl = (url: string): string | null => {
    // ex video urls
    // https://www.youtube.com/watch?v=FZZ-6Vh3oJ0
    // https://www.youtube.com/watch?v=8f1M6RM7psc&t=628s
    // https://www.youtube.com/shorts/9Tm4_YZ60UM

    let urlObject;

    try {
      urlObject = new URL(url);
    } catch {
      return null;
    }

    if (urlObject.hostname !== "www.youtube.com") return null;

    if (urlObject.pathname === "/watch") {
      return urlObject.searchParams.get("v");
    }

    if (urlObject.pathname.startsWith("/shorts")) {
      return urlObject.pathname.split("/")[2] ?? null;
    }

    return null;
  };

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const videoIdFromUrl = getVideoIdFromUrl(e.target.value);

    if (videoIdFromUrl === null) changeField("video_id", e.target.value);
    else changeField("video_id", videoIdFromUrl);
  };

  const id = useId();

  return (
    <div className="flex flex-row gap-2 items-center">
      <label htmlFor={id}>영상 아이디</label>
      <TextAreaInput
        id={id}
        rows={1}
        cols={15}
        value={videoId}
        onChange={onTextAreaChange}
      />
    </div>
  );
};
