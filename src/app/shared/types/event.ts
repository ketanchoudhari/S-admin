export interface IEvent {
  usersLogged?: number;
  sportId: string;
  tv: number;
  isFancy: number;
  activeStatus: number;
  isChecked:boolean;
  sportsName: string;
  competitionName: string;
  totalMatched: number;
  tvPid: number;
  tvMapid: number;
  time: string;
  bet: number;
  isInPlay: number;
  usersOnline: number;
  noOfBets: number;
  session: '';
  unmatched: number;
  id: number;
  eventTypeId: string;
  competitionId: number;
  eventId: number;
  eventName: string;
  status: number;
  markets: {
    marketName: string;
    gameId: number;
    sportsName: string;
    marketId: string;
    isInPlay: number;
    runners: string[];
  }[];
}
