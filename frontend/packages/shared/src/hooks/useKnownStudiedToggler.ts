import { useEffect, useRef, useState } from "react";
import { APIResponseType, UseCallAPIReturns } from "../types/apiCallTypes";
import { getEndpoint } from "../utils/apiAliases";
import { usePanelFunctionsContext } from "../contexts/PanelFunctionsContextProvider";

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
  // eslint-disable-next-line no-unused-vars
  onSuccess: (setTrueOrFalse: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onError: (response: APIResponseType) => void;
  useCallAPIInstance: UseCallAPIReturns;
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(initiallyToggled);
  const newValue = useRef<boolean>(!initiallyToggled);

  const { successful, error, loading, response, callAPI } = useCallAPIInstance;
  const { emitAll, emitInOtherPanel } = usePanelFunctionsContext();

  const url = getEndpoint({ endpoint: "update_known_studied", pk: pk });

  useEffect(() => {
    if (successful) {
      setIsToggled(newValue.current);
      onSuccess(newValue.current);
      emitAll(pk, {
        eventType: knownOrStudied,
        passToCallback: newValue.current,
      });
      emitInOtherPanel(pk, {
        eventType: "loadedDataChanged",
        passToCallback: undefined,
      });
    } else if (error) {
      onError(response);
    }
  }, [successful, error]);

  const onClick = async () => {
    newValue.current = !isToggled;

    callAPI(url, {
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
