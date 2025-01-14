import { BookOpen } from "lucide-react";
import {
  TraditionalHanjaText,
  TraditionalKoreanText,
} from "../../../text-formatters/Fonts";
import { useNavigate } from "react-router-dom";

export const ToDictionaryPageButton = () => {
  const navigate = useNavigate();

  const navigateToDictionaryPage = () => {
    navigate("/");
  };

  return (
    <button onClick={navigateToDictionaryPage}>
      <Logo />
    </button>
  );
};

const Logo = () => {
  return (
    <div
      className="text-[color:--accent-button-text-color] bg-[color:--accent-button-color] h-full flex gap-1 items-center p-1 px-3 rounded-2xl"
      title="사전으로 가기"
    >
      <BookOpen className="h-full w-auto mr-2" strokeWidth={1.5} />
      <div className="text-2xl align-bottom mr-1">
        <TraditionalKoreanText>한</TraditionalKoreanText>
        <span>—</span>
        <TraditionalHanjaText>漢</TraditionalHanjaText>
      </div>
      <div className="text-base align-bottom">
        <span>사전</span>
      </div>
    </div>
  );
};
