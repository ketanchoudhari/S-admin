export interface ISetting {
  userId: number;
  typeWise: 'sport' | 'event' | 'market';
  value: 'sportId' | 'eventId' | 'marketId';
  limitSetting: {
    exposureLimit: number;
    PNL: number;
    betDelay: number;
    fancyBonus: number;
    exchangeRate: number;
    exposurelimit: number;
    bookmakingCommission: number;
    matchOddsCommission: number;
    fancyCommission: number;
  };
  marketSetting: {
    betMinRate: number;
    betMaxRate: number;
    minStake: number;
    maxStake: number;
    maxProfit: number;
    maxLoss: number;
    commission: number;
    volMultiplier: number;
    marketBeforeInplayLimit: number;
    isUnmatchedAllowed: number;
    isCheckVolume: number;
    isMarketWise: number;
  };
  sessionSetting: {
    minStake: number;
    maxStake: number;
    maxProfit: number;
    maxLoss: number;
    commission: number;
    perRateMaxStake: number;
  };
  premiumSetting: {
    betDelay: number;
    minStake: number;
    maxStake: number;
    maxProfit: number;
 
  };
}
