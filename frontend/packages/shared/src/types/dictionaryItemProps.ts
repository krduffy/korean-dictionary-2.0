export interface UserData {}

export interface SimplifiedSenseType {
  target_code: number;
  order: number;
  definition: string;
  pos: string;
  type: string;
  category: string;
}

export interface KoreanSearchResultType {
  target_code: number;
  word: string;
  origin: string;
  word_type: string;
  user_data: null;
  senses: [SimplifiedSenseType];
}

export interface HanjaSearchResultType {
  character: string;
}
