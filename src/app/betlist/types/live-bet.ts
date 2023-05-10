export interface LiveBet {
  count:number;
  actionBy: number;
  betTime: string;
  betType: string;
  consolidateId: string;
  eventId: string;
  eventName: string;
  ipAddress: string;
  activeStatus:boolean;
  isBooked: number;
  isFancy: number;
  marketName: string;
  odds: string;
  potLiab: number;
  potProf: number;
  selName: string;
  sportId: string;
  sportName: string;
  stake: number;
  status: number;
  parentId: string;
  parentName: {
    [key: number]: string
  };
  tounamentName: string;
  userName: string;
  roundId: number;
}
