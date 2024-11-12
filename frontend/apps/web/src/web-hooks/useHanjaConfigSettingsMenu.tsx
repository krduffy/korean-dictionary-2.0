import { UpdateHanjaSearchConfigArgs } from "@repo/shared/hooks/useSearchBarArea";
import {
  ExamLevel,
  GradeLevel,
  HanjaSearchConfig,
  OperandPrefix,
} from "@repo/shared/types/panelAndViewTypes";

import {
  RadicalArea,
  DecompositionArea,
  StrokesArea,
  GradeLevelArea,
  ExamLevelArea,
} from "../web-components/dictionary-page/search-bar-area/HanjaConfigSettingAreas";

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

  const setGradeLevelOperand = (operand: OperandPrefix) => {
    updateHanjaSearchConfig({
      field: "grade_level",
      value: {
        level: config.grade_level?.level ?? "고등학교",
        operand: operand,
      },
    });
  };

  const setGradeLevelSettingLevel = (level: GradeLevel) => {
    updateHanjaSearchConfig({
      field: "grade_level",
      value: {
        level: level,
        operand: config.strokes?.operand ?? "eq",
      },
    });
  };

  const gradeLevelArea = (
    <GradeLevelArea
      gradeLevelConfig={config.grade_level}
      setOperand={setGradeLevelOperand}
      setGradeLevel={setGradeLevelSettingLevel}
      deleteGradeLevel={() => deleteSearchConfigItemByKey("grade_level")}
    />
  );

  const setExamLevelOperand = (operand: OperandPrefix) => {
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
