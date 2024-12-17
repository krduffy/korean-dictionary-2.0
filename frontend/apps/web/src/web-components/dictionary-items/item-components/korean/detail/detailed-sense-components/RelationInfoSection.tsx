import { Fragment } from "react";

import { PanelSpecificDispatcher } from "../../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { RelationType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import {
  AccentedTextWithBorder,
  ClickableLinkStyler,
} from "../../../../../text-formatters/SpanStylers";

export const RelationInfoSection = ({
  relations,
}: {
  relations: RelationType[];
}) => {
  const possibleRelationTypes = [
    "비슷한말",
    "반대말",
    "상위어",
    "하위어",
    "참고 어휘",
    "높임말",
    "방언",
    "본말",
    "옛말",
  ];

  const rows = possibleRelationTypes
    .map<[string, RelationType[]]>((relationType) => [
      relationType,
      relations.filter((relation) => relation.type === relationType),
    ])
    .filter((relationItems) => relationItems[1].length > 0)
    .map((relationItems) => (
      <RelationshipRow
        key={relationItems[0]}
        type={relationItems[0]}
        relationItems={relationItems[1]}
      />
    ));

  return <div className="flex flex-col gap-4">{rows}</div>;
};

const RelationshipRow = ({
  type,
  relationItems,
}: {
  type: string;
  relationItems: RelationType[];
}) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-[20%] text-center">
        <div className="flex flex-1 justify-center">
          <AccentedTextWithBorder accentNumber={3}>
            {type}
          </AccentedTextWithBorder>
        </div>
      </div>
      <div className="w-[80%] self-center">
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
                <ClickableLinkStyler>{relation.word}</ClickableLinkStyler>
              </PanelSpecificDispatcher>
            ) : (
              <span>{relation.word}</span>
            )}

            {innerIndex < filteredArray.length - 1 && ", "}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
