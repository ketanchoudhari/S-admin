export interface IBook {
  sportName: string;
  eventName: string;
  marketName: string;
  userName: string;
  eventId: string;
  exchangeBooks?: {
    sportName: string;
    eventId: string;
    eventName: string;
    marketId:string;
    marketName: string;
    nbBets: number;
    selections: {
      backOdd1: number;
      backOdd2: number;
      backOdd3: number;
      layOdd1: number;
      layOdd2: number;
      layOdd3: number;
      selName: string;
      totalPL: number;
      status:string;
    }[];
    users: IUserBook[];
  }[];
  fancyBook: {
    eventId: string;
    eventName: string;
    liability: number;
    marketName: string;
    max: number;
    min: number;
    nbBets: number;
    noOdd: string;
    noRuns: string;
    runs: string;
    selName: string;
    gstatus:string
    sportName: string;
    users: any[];
    yesOdd: string;
    yesRuns: string;
    totalPL: { [key: number]: number };
  }[];
}

export interface IMarketBook {
    sportName: string;
    eventId: string;
    eventName: string;
    marketName: string;
    nbBets: number;
    selections: {
      backOdd1: number;
      backOdd2: number;
      backOdd3: number;
      layOdd1: number;
      layOdd2: number;
      layOdd3: number;
      selName: string;
      totalPL: number;
    }[];
    users: IUserBook[];
}

export interface IFancyPNLBook {
  sportName: string;
  eventId: string;
  marketName: string;
  markets: {
    marketName: string;
    marketId: string;
    result:string;
    users: IUsernetPL[];
  }[];
}

export interface IUserBook {
  userName: string;
  nbBets: number;
  selections: { selName: string; totalPL: number }[];
  users: IUserBook[]
}

export interface IUsernetPL {
  userName: string;
  PLNet:number;
  playerId:number;
}
