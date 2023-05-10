export interface IMarketPL {
  commision: number;
  downLinePL: number;
  eventId: string;
  eventName: string;
  playerPL: number;
  sport: string;
  stake: number;
  upLinePL: number;
  markets: {
    commision: number;
    downLinePL: number;
    gameId: number;
    marketId: string;
    marketName: string;
    playerPL: number;
    stake: number;
    upLinePL: number;
  }[];
}
