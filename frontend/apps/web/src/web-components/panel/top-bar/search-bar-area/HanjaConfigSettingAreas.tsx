import {
  ExamLevel,
  ExamLevelConfig,
  GradeLevel,
  OperandPrefix,
  StrokeNumberConfig,
} from "@repo/shared/types/views/searchConfigTypes";
import { Minus, Plus } from "lucide-react";

export const RadicalArea = ({
  radical,
  setRadical,
  deleteRadical,
}: RadicalAreaArgs) => {
  if (radical === undefined) {
    return (
      <div className="flex justify-center">
        <KeyAdder param={"부수"} onClick={() => setRadical("")} />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadical(e.target.value);
  };

  return (
    <div className="flex flex-row justify-end gap-4">
      <input
        type="text"
        className="rounded-sm w-10"
        maxLength={1}
        onChange={handleChange}
        value={radical}
        name="radical-input"
        id="radical-input"
      />
      <KeyDeleter param={"부수"} onClick={deleteRadical} />
    </div>
  );
};

export const DecompositionArea = ({
  decomposition,
  setDecomposition,
  deleteDecomposition,
}: DecompositionAreaArgs) => {
  if (decomposition === undefined) {
    return (
      <div className="flex justify-center">
        <KeyAdder
          param={"decomposition"}
          onClick={() => setDecomposition("")}
        />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecomposition(e.target.value);
  };

  return (
    <div className="flex flex-row justify-end gap-4">
      <input
        type="text"
        className="rounded-sm w-10"
        maxLength={5}
        onChange={handleChange}
        value={decomposition}
        name="radical-input"
        id="radical-input"
      />
      <KeyDeleter param={"모양자 분해"} onClick={deleteDecomposition} />
    </div>
  );
};

export const StrokesArea = ({
  strokeNumConfig,
  setOperand,
  setStrokeNumber,
  deleteStrokes,
}: StrokesAreaArgs) => {
  if (strokeNumConfig === undefined) {
    return (
      <div className="flex justify-center">
        <KeyAdder
          param={"획수"}
          onClick={() => {
            setOperand("eq");
            setStrokeNumber(1);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 justify-end">
      <OperandPrefixInput
        operand={strokeNumConfig.operand}
        setOperand={setOperand}
      />
      <input
        type="number"
        className="w-[30%]"
        maxLength={2}
        value={strokeNumConfig.strokes}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStrokeNumber(Number(e.target.value))
        }
      />
      <KeyDeleter param={"획수"} onClick={deleteStrokes} />
    </div>
  );
};

export const GradeLevelArea = ({
  gradeLevel,
  setGradeLevel,
  deleteGradeLevel,
}: GradeLevelAreaArgs) => {
  if (gradeLevel === undefined) {
    return (
      <div className="flex justify-center">
        <KeyAdder
          param={"학교용"}
          onClick={() => {
            setGradeLevel("고등학교");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 justify-end">
      <div className="flex flex-col gap-3 justify-end">
        <GradeLevelSelector
          gradeLevel={gradeLevel}
          setGradeLevel={setGradeLevel}
        />
      </div>
      <KeyDeleter param={"획수"} onClick={deleteGradeLevel} />
    </div>
  );
};

export const ExamLevelArea = ({
  examLevelConfig,
  setOperand,
  setExamLevel,
  deleteExamLevel,
}: ExamLevelAreaArgs) => {
  if (examLevelConfig === undefined) {
    return (
      <div className="flex justify-center">
        <KeyAdder
          param={"학교용"}
          onClick={() => {
            setOperand("eq");
            setExamLevel("8급");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 justify-end">
      <div className="flex flex-col gap-3 justify-end">
        <OperandPrefixInput
          operand={examLevelConfig.operand}
          setOperand={setOperand}
        />
        <ExamLevelSelector
          examLevel={examLevelConfig.level}
          setExamLevel={setExamLevel}
        />
      </div>
      <KeyDeleter param={"획수"} onClick={deleteExamLevel} />
    </div>
  );
};

/***********************/

const KeyDeleter = ({
  param,
  onClick,
}: {
  param: string;
  onClick: () => void;
}) => {
  return (
    <button title={`${param} 설정 제거`} onClick={onClick}>
      <Minus />
    </button>
  );
};

const KeyAdder = ({
  param,
  onClick,
}: {
  param: string;
  onClick: () => void;
}) => {
  return (
    <button title={`${param} 설정 추가`} onClick={onClick}>
      <Plus />
    </button>
  );
};

type RadicalAreaArgs = {
  radical: string | undefined;
  setRadical: (radical: string) => void;
  deleteRadical: () => void;
};

type DecompositionAreaArgs = {
  decomposition: string | undefined;
  setDecomposition: (decomp: string) => void;
  deleteDecomposition: () => void;
};

const OperandPrefixInput = ({
  operand,
  setOperand,
}: {
  operand: OperandPrefix;
  setOperand: (operand: OperandPrefix) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperand(e.target.value as OperandPrefix);
  };

  return (
    <select onChange={handleChange} value={operand}>
      <option value="eq">=</option>
      <option value="not">≠</option>
      <option value="gt">{">"}</option>
      <option value="gte">≥</option>
      <option value="lt">{"<"}</option>
      <option value="lte">≤</option>
    </select>
  );
};

type StrokesAreaArgs = {
  strokeNumConfig: StrokeNumberConfig | undefined;
  setOperand: (operand: OperandPrefix) => void;
  setStrokeNumber: (number: number) => void;
  deleteStrokes: () => void;
};

type GradeLevelAreaArgs = {
  gradeLevel: GradeLevel | undefined;
  setGradeLevel: (gradeLevel: GradeLevel) => void;
  deleteGradeLevel: () => void;
};

const GradeLevelSelector = ({
  gradeLevel,
  setGradeLevel,
}: {
  gradeLevel: GradeLevel;
  setGradeLevel: (level: GradeLevel) => void;
}) => {
  return (
    <select
      value={gradeLevel}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setGradeLevel(e.target.value as GradeLevel)
      }
    >
      <option value="중학교">중학교</option>
      <option value="고등학교">고등학교</option>
      <option value="미배정">미배정</option>
    </select>
  );
};

const ExamLevelSelector = ({
  examLevel,
  setExamLevel,
}: {
  examLevel: ExamLevel;
  setExamLevel: (level: ExamLevel) => void;
}) => {
  const options = [
    "8급",
    "준7급",
    "7급",
    "준6급",
    "6급",
    "준5급",
    "5급",
    "준4급",
    "4급",
    "준3급",
    "3급",
    "준2급",
    "2급",
    "준1급",
    "1급",
    "준특급",
    "특급",
    "미배정",
  ];

  return (
    <select
      value={examLevel}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setExamLevel(e.target.value as ExamLevel)
      }
    >
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

type ExamLevelAreaArgs = {
  examLevelConfig: ExamLevelConfig | undefined;
  setOperand: (operand: OperandPrefix) => void;
  setExamLevel: (level: ExamLevel) => void;
  deleteExamLevel: () => void;
};
