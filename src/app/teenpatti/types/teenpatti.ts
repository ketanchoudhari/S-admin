export interface ITeenpatti {
  activeStatus: number;
  bet: number;
  competitionId: number;
  competitionName: string;
  eventId: number;
  eventName: string;
  eventTypeId: string;
  id: number;
  isFancy: number;
  isInPlay: number;
  markets: {
    gameId: number;
    isInPlay: number;
    marketId: string;
    marketName: string;
    open: 1;
    runners: string[];
    status: number;
  }[];
  noOfBets: number;
  port: number;
  session: string;
  sportsName: string;
  status: number;
  time: Date;
  totalMatched: number;
  tv: number;
  tvMapid: number;
  tvPid: number;
  unmatched: number;
  usersOnline: number;

  selected: boolean;
}
