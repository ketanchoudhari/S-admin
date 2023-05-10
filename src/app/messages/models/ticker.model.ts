export interface MessagesTicker {
  ticker: string;
  active?: boolean;
  id?: number;
}

export interface NewTickerResponse {
  ticker: string;
  active?: boolean;
}
