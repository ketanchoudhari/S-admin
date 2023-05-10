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
  betLock: number;
  isInPlay: number;
  usersOnline: number;
  noOfBets: number;
  session: string;
  unmatched: number;
  id: number;
  fancyInplay: number;
  eventTypeId: string;
  competitionId: number;
  eventId: number;
  eventName: string;
  status: number;
  winTheTossInplay: number;
  markets: {
    marketName: string;
    gameId: number;
    marketId: string;
    runners: string[];
    open: number;
    status: number;
  }[];
}
