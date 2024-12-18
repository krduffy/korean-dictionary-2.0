import { useEffect, useRef, useState } from "react";
import { APIResponseType, UseCallAPIReturns } from "../types/apiCallTypes";
import { getEndpoint } from "../utils/apiAliases";
import { usePanelFunctionsContext } from "../contexts/PanelFunctionsContextProvider";
import { useGlobalFunctionsContext } from "../contexts/GlobalFunctionsContextProvider";

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

  const { requestState, callAPI } = useCallAPIInstance;
  const { globalEmit } = useGlobalFunctionsContext();
  const { panelEmitOther } = usePanelFunctionsContext();

  const url = getEndpoint({ endpoint: "update_known_studied", pk: pk });

  useEffect(() => {
    if (requestState.progress === "success") {
      setIsToggled(newValue.current);
      onSuccess(newValue.current);
      /* Cache listeners use the global context */
      globalEmit(pk, {
        eventType:
          knownOrStudied === "known" ? "knownChanged" : "studiedChanged",
        passToCallback: newValue.current,
      });
      /* Loaded data changed events are scoped at the panel level */
      panelEmitOther(pk, {
        eventType: "loadedDataChanged",
        passToCallback: undefined,
      });
    } else if (requestState.progress === "error") {
      onError(requestState.response);
    }
  }, [requestState]);

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
    requestState,
    isToggled,
    onClick,
  };
};
