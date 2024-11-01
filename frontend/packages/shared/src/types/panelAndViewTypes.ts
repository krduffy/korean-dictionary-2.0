export interface View {
  /* What the search bar looks like */
  searchConfig: SearchConfig;
  /* type */
  type: ViewType;
  /* Data required to reconstruct the state of the main content */
  data: KoreanSearchViewData;
}

export type ViewType = "korean_search" | "hanja_search";

export interface KoreanSearchViewData {
  searchTerm: string;
}

export interface UsePanelArgs {
  initialView: View;
  initialSearchConfig: SearchConfig;
}

export interface UsePanelReturns {
  searchConfigSetters: SearchConfigSetters;
  // eslint-disable-next-line no-unused-vars
  submitSearch: (e: React.FormEvent) => void;
}

export type SearchConfigDictionary = "korean" | "hanja";

export interface SearchConfig {
  dictionary: SearchConfigDictionary;
  searchTerm: string;
}

export interface UseSearchSubmitterArgs {
  // eslint-disable-next-line no-unused-vars
  setView: (view: View) => void;
  searchConfig: SearchConfig;
}

export interface SearchConfigSetters {
  // eslint-disable-next-line no-unused-vars
  setSearchTerm: (searchTerm: string) => void;
  switchDictionary: () => void;
}

export interface UseSearchConfigSettersReturns {
  searchConfigSetters: SearchConfigSetters;
}

export interface UseSearchConfigSettersArgs {
  searchConfig: SearchConfig;
  // eslint-disable-next-line no-unused-vars
  setSearchConfig: (sc: SearchConfig) => void;
}
