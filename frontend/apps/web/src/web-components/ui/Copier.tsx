import { ClipboardCheck, ClipboardCopy, ClipboardX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";

export const Copier = ({ textToCopy }: { textToCopy: string }) => {
  const [successful, setSuccessful] = useState<boolean | null>(null);
  const { sendNotification } = useNotificationContext();

  useEffect(() => {
    setTimeout(() => setSuccessful(null), 5000);
  }, [successful]);

  const handleClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setSuccessful(true);
        sendNotification(
          <ClipboardSuccessMessage string="복사가 성공했습니다." />,
          1000
        );
      })
      .catch((error) => {
        if (error.name === "NotAllowedError") {
          sendNotification(<ClipboardErrorMessage string="복사가 " />, 1000);
        } else {
          sendNotification(
            <ClipboardErrorMessage string="오류가 발생했습니다." />,
            1000
          );
        }

        setSuccessful(false);
      });
  };

  return (
    <div onClick={handleClick}>
      {successful === null ? (
        <div title="복사">
          <ClipboardCopy className="cursor-pointer" />
        </div>
      ) : successful === true ? (
        <ClipboardCheck className="[color:--success-color]" />
      ) : (
        <ClipboardX className="[color:--error-text]" />
      )}
    </div>
  );
};

const ClipboardSuccessMessage = ({ string }: { string: string }) => {
  return (
    <div className="flex justify-center items-center p-2 [color:--success-color]">
      {string}
    </div>
  );
};

const ClipboardErrorMessage = ({ string }: { string: string }) => {
  return (
    <div className="flex justify-center items-center p-2 [color:--error-text]">
      {string}
    </div>
  );
};
