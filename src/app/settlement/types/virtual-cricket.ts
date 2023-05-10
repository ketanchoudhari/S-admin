export interface IVirtualCricket {
  eventId: string;
  eventName: string;
  startTime: string;
  bookMakerMarket: {
    marketName: string;
    marketId: string;
    selections: {
      selectionName: string;
      selectionId: string;
    }[];
  };
  fancyMarkets: {
    marketName: string;
    marketId: string;
  }[];
}
