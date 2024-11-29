import { useState } from "react";
import { APIResponseType, UseCallAPIReturns } from "../types/apiCallTypes";
import { getEndpoint } from "../utils/apiAliases";

export const useKnownStudiedToggler = ({
  pk,
  koreanOrHanja,
  knownOrStudied,
  initiallyToggled,
  onSuccess,
  onError,
  useCallAPIInstance,
}: {
  pk: number | string;
  koreanOrHanja: "korean" | "hanja";
  knownOrStudied: "known" | "studied";
  initiallyToggled: boolean;
  onSuccess: () => void;
  onError: (response: APIResponseType) => void;
  useCallAPIInstance: UseCallAPIReturns;
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(initiallyToggled);

  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  const url = getEndpoint({ endpoint: "update_known_studied", pk: pk });

  const onClick = async () => {
    const newValue = !isToggled;

    callAPI(url, {
      method: "PUT",
      body: JSON.stringify({
        korean_or_hanja: koreanOrHanja,
        known_or_studied: knownOrStudied,
        set_true_or_false: newValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      if (successful) {
        setIsToggled(newValue);
        onSuccess();
      } else if (error) {
        onError(response);
      }
    });
  };

  return {
    successful,
    loading,
    error,
    response,
    isToggled,
    onClick,
  };
};
