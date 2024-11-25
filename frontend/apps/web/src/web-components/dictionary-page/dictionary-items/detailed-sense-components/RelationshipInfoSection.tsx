import { Fragment } from "react";

import { PanelSpecificDispatcher } from "../../panel/PanelSpecificDispatcher";
import { RelationType } from "@repo/shared/types/dictionaryItemProps";

export const RelationInfoSection = ({
  relations,
}: {
  relations: RelationType[];
}) => {
  const possibleRelationTypes = [
    "비슷한 말",
    "반대말",
    "상위어",
    "하위어",
    "참고 어휘",
    "높임말",
    "방언",
    "본말",
    "옛말",
  ];

  return (
    <div
      style={{
        display: "table",
        borderCollapse: "separate",
        borderSpacing: "0px 5px",
      }}
    >
      {possibleRelationTypes.map((relationType) => {
        const relationItems = relations.filter(
          (relation) => relation.type === relationType
        );

        return (
          relationItems.length > 0 && (
            <RelationshipRow
              key={relationType}
              type={relationType}
              relationItems={relationItems}
            />
          )
        );
      })}
    </div>
  );
};

const RelationshipRow = ({
  type,
  relationItems,
}: {
  type: string;
  relationItems: RelationType[];
}) => {
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
        {relationItems.map((relation, innerIndex, filteredArray) => (
          <Fragment key={innerIndex}>
            {/* only render wrapped in dispatcher if it has a link ! */}
            {relation.link_target_code ? (
              <PanelSpecificDispatcher
                panelStateAction={{
                  type: "push_korean_detail",
                  target_code: relation.link_target_code,
                }}
              >
                {relation.word}
              </PanelSpecificDispatcher>
            ) : (
              <span>{relation.word}</span>
            )}

            {innerIndex < filteredArray.length - 1 && ", "}
          </Fragment>
        ))}
      </dd>
    </dl>
  );
};
