export interface ISharing {
  cricketFancySharing: number;
  cricketSharing: number;
  dogRaceSharing: number;
  horseRaceSharing: number;
  indianCasinoSharing: number;
  intCasinoSharing: number;
  soccerGoalsSharing: number;
  soccerSharing: number;
  tennisSharing: number;
  rollingCommission?: {
    fancy: number,
    casino: number,
    exchange: number,
    bookMaker: number
  },
  agentRollingCommission?: {
    fancy: number,
    casino: number,
    exchange: number,
    bookMaker: number
  }
}
