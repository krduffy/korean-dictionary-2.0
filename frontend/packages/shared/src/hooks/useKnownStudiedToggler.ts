import { useEffect, useRef, useState } from "react";
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
  onSuccess: (setTrueOrFalse: boolean) => void;
  onError: (response: APIResponseType) => void;
  useCallAPIInstance: UseCallAPIReturns;
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(initiallyToggled);
  const newValue = useRef<boolean>(!initiallyToggled);

  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  const url = getEndpoint({ endpoint: "update_known_studied", pk: pk });

  useEffect(() => {
    if (successful) {
      setIsToggled(newValue.current);
      onSuccess(newValue.current);
    } else if (error) {
      onError(response);
    }
  }, [successful, error]);

  const onClick = async () => {
    newValue.current = !isToggled;

    await callAPI(url, {
      method: "PUT",
      body: JSON.stringify({
        korean_or_hanja: koreanOrHanja,
        known_or_studied: knownOrStudied,
        set_true_or_false: newValue.current,
      }),
      headers: {
        "Content-Type": "application/json",
      },
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
