export class CurrentUser {
  balance: number;
  conversion: number;
  creditRef: number;
  cricketFancySharing: number;
  cricketSharing: number;
  currencyCode: string;
  dogRaceSharing: number;
  domainAllocation: boolean;
  allowDomainAllocation: boolean;
  allowRollingCommission: boolean;
  exposureLimit: number;
  horseRaceSharing: number;
  indianCasinoSharing: number;
  intCasinoSharing: number;
  loginTime: string;
  name: string;
  parentId: number;
  rules: string;
  soccerGoalsSharing: number;
  soccerSharing: number;
  tennisSharing: number;
  token: string;
  userId: number;
  userName: string;
  userStatus: number;
  userType: number;
  prepaid:boolean;
  lcbd:boolean;
  lcbd1:boolean;
  captcha:boolean;
  newUser:number;
  rollingCommission?: {
    fancy: number;
    casino: number;
    exchange: number;
    bookMaker: number;
  };
  agentRollingCommission?: {
    fancy: number;
    casino: number;
    exchange: number;
    bookMaker: number;
  };

  constructor() {}
}
