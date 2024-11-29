import { useKnownStudiedToggler } from "@repo/shared/hooks/useKnownStudiedToggler";
import { useCallAPIWeb } from "../../../../web-hooks/useCallAPIWeb";
import { Book, BookCheck, Star, StarOff } from "lucide-react";
import { LoadingIndicator } from "../../../other/misc/LoadingIndicator";
import { useNotificationContext } from "../../../../web-contexts/NotificationContextProvider";
import { APIResponseType } from "@repo/shared/types/apiCallTypes";

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

  const onSuccess = () => {
    sendNotification(<div>SUCCESS</div>, 2000);
  };

  const onError = (response: APIResponseType) => {
    sendNotification(<div>ERROR</div>, 2000);
  };

  const { successful, loading, error, response, isToggled, onClick } =
    useKnownStudiedToggler({
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

  return (
    <div className="h-full w-full rounded-xl bg-red" onClick={onClick}>
      <TogglerIcon
        loading={loading}
        knownOrStudied={knownOrStudied}
        isToggled={isToggled}
      />
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
