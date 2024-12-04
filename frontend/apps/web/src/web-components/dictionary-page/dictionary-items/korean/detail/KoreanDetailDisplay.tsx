import { DetailedKoreanType } from "@repo/shared/types/dictionaryItemProps";
import { DetailedSenseView } from "./DetailedSenseView";
import { StringWithHanja } from "../../../../other/string-formatters/StringWithHanja";
import { KoreanHistoryInfoSection } from "./KoreanHistoryInfo";
import { memo } from "react";
import { KoreanWordTogglers } from "../../known-studied/KnownStudiedTogglers";

export const KoreanDetailDisplay = memo(
  ({
    data,
    dropdownStates,
  }: {
    data: DetailedKoreanType;
    dropdownStates: boolean[];
  }) => {
    return (
      <div>
        <div className="mb-6 flex flex-row justify-between items-center">
          <div className="flex flex-row gap-6 items-center">
            <div className="text-[250%]">{data.word}</div>
            <div className="text-[190%]">
              <StringWithHanja string={data.origin} />
            </div>
          </div>

          {data.user_data && (
            <div>
              <KoreanWordTogglers
                pk={data.target_code}
                initiallyKnown={data.user_data.is_known}
                initiallyStudied={data.user_data.is_studied}
              />
            </div>
          )}
        </div>

        {data.senses.map((senseData, id) => (
          <div key={senseData.target_code} className="mb-4">
            <DetailedSenseView
              senseData={senseData}
              dropdownState={dropdownStates[id] ?? false}
            />
          </div>
        ))}

        {data.history_info && (
          <KoreanHistoryInfoSection historyInfo={data.history_info} />
        )}
      </div>
    );
  }
);
