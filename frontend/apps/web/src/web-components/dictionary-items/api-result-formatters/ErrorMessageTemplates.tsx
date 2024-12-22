import { ErrorMessage } from "../../text-formatters/messages/ErrorMessage";

export const NotAnArrayError = () => {
  return <ErrorMessage error="데이터나 결과는 배열이 아닙니다." />;
};

export const NoResponseError = () => {
  return <ErrorMessage error="api 요청은 응답이 없었습니다." />;
};

export const WrongFormatError = () => {
  return <ErrorMessage error="데이터는 구조가 안 됩니다." />;
};
