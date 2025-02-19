import { VideoUserExamplesView } from "./VideoUserExamplesView";

export const UserExamplesPageView = ({
  headwordTargetCode,
}: {
  headwordTargetCode: number;
}) => {
  return <VideoUserExamplesView headwordTargetCode={headwordTargetCode} />;
};
