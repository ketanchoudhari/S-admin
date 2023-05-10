export interface ICasinoTable {
  tableName: string;
  markets: ICasinoMarket[];
}

export interface ICasinoMarket {
  tableName: string;
  marketName: string;
  gameId: string;
}
