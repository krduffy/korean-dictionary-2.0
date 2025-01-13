import { useEffect } from "react";
import { APIResponseType, UseCallAPIReturns } from "../types/apiCallTypes";
import { getEndpoint } from "../utils/apiAliases";
import { usePanelFunctionsContext } from "../contexts/PanelFunctionsContextProvider";
import { useGlobalFunctionsContext } from "../contexts/GlobalFunctionsContextProvider";

export const useKnownStudiedToggler = ({
  pk,
  koreanOrHanja,
  knownOrStudied,
  isToggled,
  onSuccess,
  onError,
  useCallAPIInstance,
}: {
  pk: number | string;
  koreanOrHanja: "korean" | "hanja";
  knownOrStudied: "known" | "studied";
  isToggled: boolean;
  // eslint-disable-next-line no-unused-vars
  onSuccess: (setTrueOrFalse: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onError: (response: APIResponseType) => void;
  useCallAPIInstance: UseCallAPIReturns;
}) => {
  const newValueOnClick = !isToggled;

  const { requestState, callAPI } = useCallAPIInstance;
  const { globalEmit } = useGlobalFunctionsContext();
  const { panelEmitSelf, panelEmitOther } = usePanelFunctionsContext();

  const url = getEndpoint({ endpoint: "update_known_studied", pk: pk });

  useEffect(() => {
    if (requestState.progress === "success") {
      onSuccess(newValueOnClick);
      /* Cache listeners use the global context */
      globalEmit(pk, {
        eventType:
          knownOrStudied === "known" ? "knownChanged" : "studiedChanged",
        passToCallback: newValueOnClick,
      });
      /* Loaded data changed events are scoped at the panel level */
      panelEmitSelf(pk, {
        eventType: "loadedDataChanged",
        passToCallback: undefined,
      });
      panelEmitOther(pk, {
        eventType: "loadedDataChanged",
        passToCallback: undefined,
      });
    } else if (requestState.progress === "error") {
      onError(requestState.response);
    }
  }, [requestState]);

  const onClick = async () => {
    callAPI(url, {
      method: "PUT",
      body: JSON.stringify({
        korean_or_hanja: koreanOrHanja,
        known_or_studied: knownOrStudied,
        set_true_or_false: newValueOnClick,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return {
    requestState,
    onClick,
  };
};
