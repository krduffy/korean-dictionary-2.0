import { DerivedExampleTextInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { BasicAPIDataFormatter } from "../api-result-formatters/BasicAPIDataFormatter";
import { isDerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { DerivedExampleTextDisplay } from "../item-components/user-examples/derived-example-text/DerivedExampleTextDisplay";
import { memo } from "react";
export const DerivedExampleTextDetailView = memo(
  ({
    sourceTextPk,
    interactionData,
  }: {
    sourceTextPk: number;
    interactionData: DerivedExampleTextInteractionData;
  }) => {
    const url = getEndpoint({
      endpoint: "get_derived_example_text",
      pk: sourceTextPk,
    });

    const { requestState, refetch } = useFetchProps({
      url: url,
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
      refetchDependencyArray: [sourceTextPk],
    });

    return (
      <BasicAPIDataFormatter
        requestState={requestState}
        verifier={isDerivedExampleTextType}
        interactionData={interactionData}
        DisplayComponent={DerivedExampleTextDisplay}
      />
    );
  }
);
