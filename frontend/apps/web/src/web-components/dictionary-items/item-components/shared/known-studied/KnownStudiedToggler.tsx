import { useKnownStudiedToggler } from "@repo/shared/hooks/useKnownStudiedToggler";
import { useCallAPIWeb } from "../../../../../shared-web-hooks/useCallAPIWeb";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { StarAnimationWrapper } from "./StarAnimationWrapper";
import { ErrorMessage } from "../../../../text-formatters/messages/ErrorMessage";
import { KnownStudiedIcon } from "./KnownStudiedIcon";

export const KnownStudiedToggler = ({
  pk,
  knownOrStudied,
  koreanOrHanja,
  isToggled,
}: {
  pk: number | string;
  koreanOrHanja: "korean" | "hanja";
  knownOrStudied: "known" | "studied";
  isToggled: boolean;
}) => {
  const { sendNotification } = useNotificationContext();

  const onSuccess = (setTrueOrFalse: boolean) => {
    sendNotification(
      <SuccessMessage
        koreanOrHanja={koreanOrHanja}
        knownOrStudied={knownOrStudied}
        setTrueOrFalse={setTrueOrFalse}
      />,
      2000
    );
  };

  const onError = (response: APIResponseType) => {
    sendNotification(<ErrorMessage error={response} />, 2000);
  };

  const { requestState, onClick } = useKnownStudiedToggler({
    pk,
    koreanOrHanja,
    knownOrStudied,
    isToggled,
    onSuccess,
    onError,
    useCallAPIInstance: useCallAPIWeb({
      cacheResults: false,
    }),
  });

  return isToggled ? (
    <button className="h-full w-full rounded-xl" onClick={onClick}>
      <StarAnimationWrapper numStars={10}>
        <div className="h-full border-2 rounded-md p-2 border-[color:--accent-1] shadow-lg transition-shadow hover:shadow-xl">
          <KnownStudiedIcon
            loading={requestState.progress === "loading"}
            knownOrStudied={knownOrStudied}
            isToggled={isToggled}
          />
        </div>
      </StarAnimationWrapper>
    </button>
  ) : (
    <button className="h-full w-full rounded-xl" onClick={onClick}>
      <div className="h-full border-2 rounded-md p-2 border-[color:--accent-1] shadow-lg transition-shadow hover:shadow-xl">
        <KnownStudiedIcon
          loading={requestState.progress === "loading"}
          knownOrStudied={knownOrStudied}
          isToggled={isToggled}
        />
      </div>
    </button>
  );
};

const SuccessMessage = ({
  koreanOrHanja,
  knownOrStudied,
  setTrueOrFalse,
}: {
  koreanOrHanja: "korean" | "hanja";
  knownOrStudied: "known" | "studied";
  setTrueOrFalse: boolean;
}) => {
  const subject = koreanOrHanja === "korean" ? "단어가" : "한자가";
  let location = knownOrStudied === "known" ? "암기장에" : "복습장에";
  if (setTrueOrFalse === false) {
    location = location.concat("서");
  }
  const action = setTrueOrFalse === true ? "첨가되었습니다" : "삭제되었습니다";

  return (
    <div className="text-center">
      {subject} {location} {action}
    </div>
  );
};
