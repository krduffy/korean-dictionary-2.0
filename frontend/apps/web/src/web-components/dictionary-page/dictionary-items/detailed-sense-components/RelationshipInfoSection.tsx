import { Fragment } from "react";

import { PanelSpecificDispatcher } from "../../panel/PanelSpecificDispatcher.js";
import { RelationInfoType } from "@repo/shared/types/dictionaryItemProps.js";

export const RelationInfoSection = ({
  relationInfo,
}: {
  relationInfo: RelationInfoType;
}) => {
  const possibleRelationTypes = [
    "하위어",
    "상위어",
    "반대말",
    "비슷한말",
    "방언",
    "높임말",
    "옛말",
    "참고 어휘",
    "본말",
  ];

  const getRowForType = (type) => {
    return (
      <dl>
        <dt
          style={{
            display: "table-cell",
            whiteSpace: "nowrap",
            width: "100px",
          }}
        >
          {type}
        </dt>
        <dd style={{ display: "table-cell" }}>
          {relationInfo
            .filter((relation) => relation["type"] === type)
            .map((filteredRelation, innerIndex, filteredArray) => (
              <Fragment key={innerIndex}>
                {/* only render wrapped in dispatcher if it has a link ! */}
                {filteredRelation.link_target_code ? (
                  <PanelSpecificDispatcher
                    panelStateAction={{
                      type: "push_korean_detail",
                      target_code: filteredRelation.link_target_code,
                    }}
                  >
                    {filteredRelation.word}
                  </PanelSpecificDispatcher>
                ) : (
                  <span>{filteredRelation.word}</span>
                )}

                {innerIndex < filteredArray.length - 1 && ", "}
              </Fragment>
            ))}
        </dd>
      </dl>
    );
  };

  return (
    <div
      style={{
        display: "table",
        borderCollapse: "separate",
        borderSpacing: "0px 5px",
      }}
    >
      {possibleRelationTypes.map(
        (relationType, index) =>
          relationInfo.filter((relation) => relation["type"] === relationType)
            .length > 0 && (
            <Fragment key={index}>{getRowForType(relationType)}</Fragment>
          )
      )}
    </div>
  );
};
