export class User {
  userId: number;
  userName: string;
  name: string;
  balance: number;
  downlineBalance: number;
  loginTime: Date;
  conversion: number;
  userType: number;
  creditRef: number;
  availableBalance: number;
  balanceTotal:number;
  exposure: number;
  parentId: number;
  playerBalance: number;
  userStatus: number;
  refPL: number;
  plnet:number;
  loginStatus: number;
  userAccess: string;
  minStake: number;
  maxStake: number;
  maxProfit: number;
  beforeInplayProfit: number;
  betLock: number;
  volumeSource: number;
  volMultiplier: number;
  betDelay: number;
  winCommission: number;
  unmatchedBets: number;
  parentDetails: string;
  createdTime: string;
  sharePercent: number;
  currencyId: number;
  isVrnlCustomer: number;
  domainName: string;
  loginIp: string;
  notes: string;
  exposureLimit: number;

  cricketSharing: number;
  cricketFancySharing: number;
  soccerSharing: number;
  soccerGoalsSharing: number;
  tennisSharing: number;
  bmCommission: number;
  indianCasinoSharing: number;
  dogRaceSharing: number;
  horseRaceSharing: number;

  showBalance = false;
  selectDW: 1 | 2 = null;
  editCreditRef: boolean = false;
  agentRollingCommission: {fancy: number, casino: number, exchange: number, bookMaker: number}
  rollingCommission: {fancy: number, casino: number, exchange: number, bookMaker: number}


}
