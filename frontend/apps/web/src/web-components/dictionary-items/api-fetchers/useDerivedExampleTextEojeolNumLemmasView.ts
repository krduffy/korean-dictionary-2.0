import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useEffect, useState } from "react";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { useKoreanSearchResultListenerHandler } from "@repo/shared/hooks/listener-handlers/viewSpecificListenerHandlers";
import { DerivedExampleTextEojeolNumLemmasData } from "@repo/shared/types/views/userExampleViewTypes";

export const useDerivedExampleTextEojeolNumLemmasView = ({
  data,
}: {
  data: DerivedExampleTextEojeolNumLemmasData;
}) => {
  const url = getEndpoint({
    endpoint: "get_derived_example_lemmas_from_text_at_eojeol_num",
    queryParams: {
      page: data.page,
    },
    pk: [data.source_text_pk, data.eojeol_num],
  });

  const { requestState, refetch } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [data.page, data.eojeol_num, data.source_text_pk],
  });

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  useKoreanSearchResultListenerHandler({
    url: url,
    response: requestState.response,
    refetch: refetch,
  });

  /* A copy of request state that will pretend to be idle even if there was a 
       successful response if the number of results is 1. This is to allow
       the redirection to the detail page to happen before any rendering of 
       the normal korean search result page occurs. */
  const [fakedRequestState, setFakedRequestState] = useState<RequestStateType>({
    progress: "idle",
    response: null,
  });

  useEffect(() => {
    /* If success + count of 1 then response is not acknowledged */
    if (
      requestState.progress === "success" &&
      requestState.response?.count === 1
    ) {
      panelDispatchStateChangeSelf({
        type: "push_korean_detail",
        // @ts-ignore
        target_code: requestState.response.results[0].target_code,
        overwriteCurrentView: true,
      });
    } else {
      setFakedRequestState({
        progress: requestState.progress,
        response: requestState.response,
      });
    }
  }, [requestState]);

  return {
    fakedRequestState,
  };
};
