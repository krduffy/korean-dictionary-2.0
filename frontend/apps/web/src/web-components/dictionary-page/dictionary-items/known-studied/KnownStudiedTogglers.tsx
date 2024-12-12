import { useKnownStudiedToggler } from "@repo/shared/hooks/useKnownStudiedToggler";
import { useCallAPIWeb } from "../../../../web-hooks/useCallAPIWeb";
import { Book, BookCheck, Star, StarOff } from "lucide-react";
import { LoadingIndicator } from "../../../other/misc/LoadingIndicator";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { APIResponseType } from "@repo/shared/types/apiCallTypes";
import { ErrorMessage } from "../../../../web-components/other/misc/ErrorMessage";
import { useStarAnimation } from "./useStarAnimation";
import { useSettingsContext } from "../../../../web-contexts/SettingsContext";

export const KoreanWordTogglers = ({
  pk,
  initiallyKnown,
  initiallyStudied,
}: {
  pk: number;
  initiallyKnown: boolean;
  initiallyStudied: boolean;
}) => {
  return (
    <div className="flex gap-2 h-full">
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="known"
        koreanOrHanja="korean"
        initiallyToggled={initiallyKnown}
      />
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="studied"
        koreanOrHanja="korean"
        initiallyToggled={initiallyStudied}
      />
    </div>
  );
};

export const HanjaTogglers = ({
  pk,
  initiallyKnown,
  initiallyStudied,
}: {
  pk: string;
  initiallyKnown: boolean;
  initiallyStudied: boolean;
}) => {
  return (
    <div className="flex gap-2">
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="known"
        koreanOrHanja="hanja"
        initiallyToggled={initiallyKnown}
      />
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="studied"
        koreanOrHanja="hanja"
        initiallyToggled={initiallyStudied}
      />
    </div>
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
      <div className="h-full border-2 rounded-md p-2 border-[color:--accent-1] shadow-lg transition-shadow hover:shadow-xl">
        <TogglerIcon
          loading={loading}
          knownOrStudied={knownOrStudied}
          isToggled={isToggled}
        />
      </div>
    ),
    numStars: 10,
  });

  return (
    <div className="h-full w-full rounded-xl" onClick={onClick}>
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
  const { fontSizeSettings } = useSettingsContext();
  const height = fontSizeSettings.relativeFontSize * 24;

  if (loading)
    return (
      <div style={{ height: `${height}px`, width: `${height}px` }}>
        <LoadingIndicator />
      </div>
    );

  const togglerContent = {
    known: {
      toggled: {
        icon: <BookCheck className="h-full w-full" />,
        title: "암기장에 추가되어 있습니다.",
      },
      notToggled: {
        icon: <Book className="h-full w-full" />,
        title: "암기장에 추가되어 있지 않습니다.",
      },
    },
    studied: {
      toggled: {
        icon: <Star className="[color:--accent-6] h-full w-full" />,
        title: "복습장에 저장되어 있습니다.",
      },
      notToggled: {
        icon: <StarOff className="h-full w-full" />,
        title: "복습장에 저장되어 있지 않습니다.",
      },
    },
  };

  const state = isToggled ? "toggled" : "notToggled";
  const { icon, title } = togglerContent[knownOrStudied][state];

  return (
    <div
      title={title}
      style={{
        height: `${height}px`,
        width: `${height}px`,
      }}
    >
      {icon}
    </div>
  );
};
