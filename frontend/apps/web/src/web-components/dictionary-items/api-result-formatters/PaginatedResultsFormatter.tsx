import { API_PAGE_SIZE } from "@repo/shared/constants";
import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { SearchResultType } from "@repo/shared/types/views/dictionary-items/sharedTypes";
import { ComponentType, ReactNode } from "react";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "./ErrorMessageTemplates";
import { NoResultsMessage } from "../../dictionary-page/views/view-components/ResultsMessages";
import { ErrorMessage } from "../../text-formatters/ErrorMessage";

export const PaginatedResultsFormatter = <ResultType extends SearchResultType>({
  requestState,
  searchTerm,
  verifier,
  ResultComponent,
  LoadingComponent = DefaultSkeleton,
}: {
  requestState: RequestStateType;
  searchTerm: string;
  verifier: (result: unknown) => result is ResultType;
  ResultComponent: ComponentType<{ result: ResultType }>;
  LoadingComponent?: ComponentType;
}): ReactNode => {
  const { progress, response } = requestState;

  if (progress === "idle") return <></>;

  if (progress === "loading") {
    return (
      <>
        {Array(API_PAGE_SIZE)
          .fill(null)
          .map((_, id) => (
            <LoadingComponent key={id} />
          ))}
      </>
    );
  }

  if (progress === "error") {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!response) {
    return <NoResponseError />;
  }

  if (response.count === 0) {
    return <NoResultsMessage searchTerm={searchTerm} />;
  }

  if (!Array.isArray(response.results)) {
    return <NotAnArrayError />;
  }

  if (!response.results.every((data) => verifier(data))) {
    return <WrongFormatError />;
  }

  return (
    <>
      {response.results.map((result, id) => (
        <ResultComponent key={id} result={result} />
      ))}
    </>
  );
};

const DefaultSkeleton = () => {
  return (
    <div className="grid min-h-16 animate-pulse">
      <div className="row-span-1 col-span-1 bg-slate-700"></div>
      <div className="row-span-1 col-span-4 bg-slate-700"></div>
    </div>
  );
};
