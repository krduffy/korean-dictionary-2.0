import { KoreanSearchConfigSettingsMenu } from "./KoreanConfigSettingsMenu";
import {
  UpdateHanjaSearchConfigArgs,
  UpdateKoreanSearchConfigArgs,
} from "@repo/shared/hooks/useSearchBarArea";

import { Settings2 } from "lucide-react";
import { ButtonWithClickDropdown } from "../../../ui/ButtonWithClickDropdown";
import { HanjaSearchConfigSettingsMenu } from "./HanjaConfigSettingsMenu";
import { DictionarySelector } from "./DictionarySelector";
import { SearchBarConfig } from "@repo/shared/types/views/searchConfigTypes";

export interface SearchSettingsButtonArgs {
  searchConfig: SearchBarConfig;
  updateKoreanSearchConfig: ({
    // eslint-disable-next-line no-unused-vars
    field,
    // eslint-disable-next-line no-unused-vars
    value,
  }: UpdateKoreanSearchConfigArgs) => void;
  updateHanjaSearchConfig: ({
    // eslint-disable-next-line no-unused-vars
    field,
    // eslint-disable-next-line no-unused-vars
    value,
  }: UpdateHanjaSearchConfigArgs) => void;
  switchDictionary: () => void;
  deleteSearchConfigItemByKey: (keyToDelete: string) => void;
}

export const SearchSettingsButton = ({
  searchConfig,
  updateKoreanSearchConfig,
  updateHanjaSearchConfig,
  switchDictionary,
  deleteSearchConfigItemByKey,
}: SearchSettingsButtonArgs) => {
  const buttonContent = (
    <div className="cursor-pointer w-full h-full">
      <Settings2 />
    </div>
  );

  const dropdownContent = (
    <div className="w-72">
      <SearchSettingsMenu
        searchConfig={searchConfig}
        updateKoreanSearchConfig={updateKoreanSearchConfig}
        updateHanjaSearchConfig={updateHanjaSearchConfig}
        switchDictionary={switchDictionary}
        deleteSearchConfigItemByKey={deleteSearchConfigItemByKey}
      />
    </div>
  );

  return (
    <ButtonWithClickDropdown
      buttonContent={buttonContent}
      dropdownContent={dropdownContent}
      addXInTopRight={true}
      positioning={{
        verticalAlignment: {
          hashMarkAlignment: "entirely-after",
          relativeHashMark: "end",
        },
        horizontalAlignment: {
          hashMarkAlignment: "middles-aligned",
          relativeHashMark: "middle",
        },
      }}
    />
  );
};

const SearchSettingsMenu = ({
  searchConfig,
  updateKoreanSearchConfig,
  updateHanjaSearchConfig,
  switchDictionary,
  deleteSearchConfigItemByKey,
}: SearchSettingsButtonArgs) => {
  return (
    <div className="min-h-12 max-h-96 overflow-y-scroll bg-[color:--background-tertiary] px-6 py-3 rounded-md border-4 border-[color:--accent-border-color]">
      <div
        style={{
          fontSize: "125%",
        }}
        className="mb-3 text-center bg-[color:--accent-4] rounded-md py-1"
      >
        검색할 사전
      </div>
      <DictionarySelector
        searchConfig={searchConfig}
        switchDictionary={switchDictionary}
      />
      <br />
      <div
        style={{ fontSize: "125%" }}
        className="mb-3 text-center bg-[color:--accent-4] rounded-md py-1"
      >
        검색 변수 설정
      </div>
      {searchConfig.dictionary === "korean" ? (
        <KoreanSearchConfigSettingsMenu
          config={searchConfig.config}
          updateKoreanSearchConfig={updateKoreanSearchConfig}
        />
      ) : (
        <HanjaSearchConfigSettingsMenu
          config={searchConfig.config}
          updateHanjaSearchConfig={updateHanjaSearchConfig}
          deleteSearchConfigItemByKey={deleteSearchConfigItemByKey}
        />
      )}
    </div>
  );
};
