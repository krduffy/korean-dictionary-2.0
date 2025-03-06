import { UpdateHanjaSearchConfigArgs } from "@repo/shared/hooks/useSearchBarArea";
import {
  RadicalArea,
  DecompositionArea,
  StrokesArea,
  GradeLevelArea,
  ExamLevelArea,
} from "./HanjaConfigSettingAreas";
import {
  ExamLevel,
  GradeLevel,
  HanjaSearchConfig,
  OperandPrefix,
} from "@repo/shared/types/views/searchConfigTypes";

export const useHanjaConfigSettingsMenu = ({
  config,
  updateHanjaSearchConfig,
  deleteSearchConfigItemByKey,
}: {
  config: HanjaSearchConfig;
  updateHanjaSearchConfig: (args: UpdateHanjaSearchConfigArgs) => void;
  deleteSearchConfigItemByKey: (keyToDelete: string) => void;
}) => {
  const radicalArea = (
    <RadicalArea
      radical={config.radical}
      setRadical={(radical: string) =>
        updateHanjaSearchConfig({
          field: "radical",
          value: radical,
        })
      }
      deleteRadical={() => deleteSearchConfigItemByKey("radical")}
    />
  );

  const decompositionArea = (
    <DecompositionArea
      decomposition={config.decomposition}
      setDecomposition={(decomposition: string) =>
        updateHanjaSearchConfig({
          field: "decomposition",
          value: decomposition,
        })
      }
      deleteDecomposition={() => deleteSearchConfigItemByKey("decomposition")}
    />
  );

  const setStrokeOperand = (operand: OperandPrefix) => {
    updateHanjaSearchConfig({
      field: "strokes",
      value: {
        strokes: config.strokes?.strokes ?? 1,
        operand: operand,
      },
    });
  };

  const setStrokeNum = (num: number) => {
    updateHanjaSearchConfig({
      field: "strokes",
      value: {
        strokes: num,
        operand: config.strokes?.operand ?? "eq",
      },
    });
  };

  const strokesArea = (
    <StrokesArea
      strokeNumConfig={config.strokes}
      setOperand={setStrokeOperand}
      setStrokeNumber={setStrokeNum}
      deleteStrokes={() => {
        deleteSearchConfigItemByKey("strokes");
      }}
    />
  );

  const setGradeLevelSettingLevel = (level: GradeLevel) => {
    updateHanjaSearchConfig({
      field: "grade_level",
      value: level,
    });
  };

  const gradeLevelArea = (
    <GradeLevelArea
      gradeLevel={config.grade_level}
      setGradeLevel={setGradeLevelSettingLevel}
      deleteGradeLevel={() => deleteSearchConfigItemByKey("grade_level")}
    />
  );

  const setExamLevelOperand = (operand: OperandPrefix): void => {
    updateHanjaSearchConfig({
      field: "exam_level",
      value: {
        level: config.exam_level?.level ?? "8급",
        operand: operand,
      },
    });
  };

  const setExamLevelSettingLevel = (level: ExamLevel) => {
    updateHanjaSearchConfig({
      field: "exam_level",
      value: {
        level: level,
        operand: config.strokes?.operand ?? "eq",
      },
    });
  };

  const examLevelArea = (
    <ExamLevelArea
      examLevelConfig={config.exam_level}
      setOperand={setExamLevelOperand}
      setExamLevel={setExamLevelSettingLevel}
      deleteExamLevel={() => deleteSearchConfigItemByKey("exam_level")}
    />
  );

  return {
    examLevelArea,
    gradeLevelArea,
    radicalArea,
    strokesArea,
    decompositionArea,
  };
};
