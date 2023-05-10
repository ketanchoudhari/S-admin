import { Injectable } from '@angular/core';
import { IEvent } from '../shared/types/event';

@Injectable({
  providedIn: 'root'
})
export class DataFormatService {

  constructor() { }
  competitionWise(activeGames: IEvent[]) {
    let competitions = [];
    activeGames.forEach((event: IEvent) => {
      if(event.competitionName != '' && !competitions.some(el => el.competitionId == event.competitionId))
          competitions.push({
            competitionName: event.competitionName,
            competitionId: (event.competitionId).toString(),
            sportsName:event.sportsName,
            sportId:event.sportId,
          })
    })
    return competitions;
  }

  marketWise(activeGames: IEvent[]) {
    let markets = [];
    activeGames.forEach((event: IEvent) => {
      if (event.markets) {
        event.markets.forEach((market)=> {
          markets.push({
            ...market,
            eventName: event.eventName,
            eventTypeId: event.eventTypeId,
          })
        })
      }
    })
    return markets;
  }
}
