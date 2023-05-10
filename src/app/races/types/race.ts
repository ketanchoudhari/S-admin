export interface IRace {
  raceName: string;
  eventTypeId: number;
  countries?: IRaceCountry[];
  country?: IRaceCountry;
}

export interface IRaceCountry {
  active: number;
  country: string;
  countryCode: string;
}
