import { useForm } from "@repo/shared/hooks/useForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";

export const KoreanWordKnownToggler = ({ pk, initiallyKnown }) => {
  const { successful, error, loading, response, postForm } = useForm({
    url: getEndpoint({ endpoint: "update_known_studied", pk: pk }),
    initialFormData: {
      known_or_studied: "known",
      korean_or_hanja: "korean",
      set_true_or_false: initiallyKnown ? "true" : "false",
    },
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false })
      .useCallAPIReturns,
  });

  return (
    <form onSubmit={postForm}>
      <input className="bg-red" type="button" />
    </form>
  );
};
