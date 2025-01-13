import { API_PAGE_SIZE } from "@repo/shared/constants";
import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { SearchResultType } from "@repo/shared/types/views/dictionary-items/sharedTypes";
import { ComponentType, ReactNode } from "react";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "../ErrorMessageTemplates";
import { NoResultsMessage } from "./ResultsMessages";
import { ErrorMessage } from "../../../text-formatters/messages/ErrorMessage";

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
    return <ErrorMessage error={response} />;
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
        <SearchResultWrapper key={id}>
          <ResultComponent result={result} />
        </SearchResultWrapper>
      ))}
    </>
  );
};

const SearchResultWrapper = ({
  children,
  additionalStyling,
}: {
  children: ReactNode;
  additionalStyling?: string;
}) => {
  return (
    <div
      className={`bg-[color:--background-tertiary] rounded-2xl 
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[color:--border-color] p-4 my-4
          ${additionalStyling}`}
    >
      {children}
    </div>
  );
};

const DefaultSkeleton = () => {
  return (
    <SearchResultWrapper additionalStyling="min-h-16 animate-pulse">
      <></>
    </SearchResultWrapper>
  );
};
