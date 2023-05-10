export interface IProfitLoss {
  PL: number;
  commission: number;
  eventName: string;
  marketName: string;
  netPL: number;
  round: string;
  settledDate: string;
  sportName: string;
  startTime: string;
  bets: {
    betId: string;
    betTime: string;
    betType: string;
    odds: string;
    pl: number;
    selName: string;
    stake: number;
  }[];
  totalStakes: number;
  backTotal: number;
  layTotal: number;
  mktTotal: number;
  comm: number;
}
