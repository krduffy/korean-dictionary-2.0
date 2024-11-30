import { useKnownStudiedToggler } from "@repo/shared/hooks/useKnownStudiedToggler";
import { useCallAPIWeb } from "../../../../web-hooks/useCallAPIWeb";
import { Book, BookCheck, Star, StarOff } from "lucide-react";
import { LoadingIndicator } from "../../../other/misc/LoadingIndicator";
import { useNotificationContext } from "../../../../web-contexts/NotificationContextProvider";
import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { ErrorMessage } from "../../../../web-components/other/misc/ErrorMessage";
import { useStarAnimation } from "./StarShootWrapper";

export const KoreanWordKnownToggler = ({
  pk,
  initiallyToggled,
}: {
  pk: number;
  initiallyToggled: boolean;
}) => {
  return (
    <KnownStudiedToggler
      pk={pk}
      knownOrStudied="known"
      koreanOrHanja="korean"
      initiallyToggled={initiallyToggled}
    />
  );
};

export const KoreanWordStudiedToggler = ({
  pk,
  initiallyToggled,
}: {
  pk: number;
  initiallyToggled: boolean;
}) => {
  return (
    <KnownStudiedToggler
      pk={pk}
      knownOrStudied="studied"
      koreanOrHanja="korean"
      initiallyToggled={initiallyToggled}
    />
  );
};

export const HanjaKnownToggler = ({
  pk,
  initiallyToggled,
}: {
  pk: string;
  initiallyToggled: boolean;
}) => {
  return (
    <KnownStudiedToggler
      pk={pk}
      knownOrStudied="known"
      koreanOrHanja="hanja"
      initiallyToggled={initiallyToggled}
    />
  );
};

export const HanjaStudiedToggler = ({
  pk,
  initiallyToggled,
}: {
  pk: string;
  initiallyToggled: boolean;
}) => {
  return (
    <KnownStudiedToggler
      pk={pk}
      knownOrStudied="studied"
      koreanOrHanja="hanja"
      initiallyToggled={initiallyToggled}
    />
  );
};

export const SuccessMessage = ({
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

const sparkleEvent = new CustomEvent("dosparkle", {
  cancelable: true,
  bubbles: false,
});

const KnownStudiedToggler = ({
  pk,
  knownOrStudied,
  koreanOrHanja,
  initiallyToggled,
}: {
  pk: number | string;
  koreanOrHanja: "korean" | "hanja";
  knownOrStudied: "known" | "studied";
  initiallyToggled: boolean;
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
    if (setTrueOrFalse) {
      triggerAnimation();
    }
  };

  const onError = (response: APIResponseType) => {
    sendNotification(<ErrorMessage errorResponse={response} />, 2000);
  };

  const { loading, isToggled, onClick } = useKnownStudiedToggler({
    pk,
    koreanOrHanja,
    knownOrStudied,
    initiallyToggled,
    onSuccess,
    onError,
    useCallAPIInstance: useCallAPIWeb({
      cacheResults: false,
    }),
  });

  const { sparkleWrappedChild, triggerAnimation } = useStarAnimation({
    buttonContent: (
      <TogglerIcon
        loading={loading}
        knownOrStudied={knownOrStudied}
        isToggled={isToggled}
      />
    ),
    numStars: 10,
  });

  return (
    <div className="h-full w-full rounded-xl bg-red" onClick={onClick}>
      {sparkleWrappedChild}
    </div>
  );
};

const TogglerIcon = ({
  loading,
  knownOrStudied,
  isToggled,
}: {
  loading: boolean;
  knownOrStudied: "known" | "studied";
  isToggled: boolean;
}) => {
  if (loading) return <LoadingIndicator />;

  const knownIcon = <BookCheck className="h-full w-full" />;
  const notKnownIcon = <Book className="h-full w-full" />;
  const studiedIcon = <Star className="h-full w-full" />;
  const notStudiedIcon = <StarOff className="h-full w-full" />;

  if (knownOrStudied === "known") {
    return isToggled ? knownIcon : notKnownIcon;
  }
  if (knownOrStudied === "studied") {
    return isToggled ? studiedIcon : notStudiedIcon;
  }
};
