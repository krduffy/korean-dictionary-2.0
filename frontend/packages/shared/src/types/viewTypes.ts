export interface View {
  type: "korean_search";
  data: KoreanSearchViewData;
}

export interface KoreanSearchViewData {
  searchTerm: string;
}
