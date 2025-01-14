import { Book, BookCheck, Star, StarOff } from "lucide-react";
import { LoadingIndicator } from "../../../../ui/LoadingIndicator";
import { useSettingsContext } from "../../../../../web-contexts/SettingsContext";

export const KnownStudiedIcon = ({
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
        icon: <BookCheck className="[color:--accent-5] h-full w-full" />,
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
