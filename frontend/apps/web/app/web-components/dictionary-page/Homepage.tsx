import { useFetchPropsWeb } from "../../web-hooks/useFetchPropsWeb";
import { getEndpoint } from "@repo/shared/utils/apiAliases";

export const Homepage = () => {
  const { successful, error, loading, response, props } = useFetchPropsWeb({
    url: getEndpoint({ endpoint: "homepage" }),
  });

  if (!successful || !props) {
    return <div>not successful</div>;
  }

  return <div>My username is {props?.username}</div>;
};
