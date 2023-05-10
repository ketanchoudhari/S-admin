export interface IDownlinePL {
  totalStake: any;
  userName: string;
  userType: number;
  userId: number;
  stake: number;
  playerPL: number;
  playerNetPL: number;
  playerGrossPL:number;
  downLinePL: number;
  downlinePL: number;
  upLinePL: number;
  uplinePL: number;
  commision: number;
  sportsReport: ISportReport[];
  downLine: IDownlinePL[];
  ownPL: number;
  showDownline: boolean;
}

export interface ISportReport {
  sport: string;
  stake: number;
  playerNetPL: number;
  playerPL: number;
  downLinePL: number;
  upLinePL: number;
  commision: number;
}
