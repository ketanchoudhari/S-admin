import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CommonService } from 'src/app/services/common.service';
import * as _ from 'lodash'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FullmarketService {
  baseUrl :string;
  // raceUrl = environment.raceUrl;
  scoreUrl = environment.scoreUrl;
  oddsSocketUrl = environment.oddsSocketUrl;

  private raceUrl;
  private sportUrl;
  private fancyUrl;
  private sportSocketApi;


  private _oddsSub = new BehaviorSubject<any>(null);
  odds$ = this._oddsSub.asObservable();

  subject$: WebSocket;
  subject1$: WebSocket[] = [];

  marketId;

  socketTimeOut: boolean = true;
  intervalSub: Subscription;
  timeOutOdds;

  marketIds = '';

  matchId: any;
  inPlay$ = new Subject();
  racingSocketApi: string;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.inPlay$.subscribe((inPlay) => {
      this.startOddsInterval(inPlay == 1 ? 500 : 10000);
    });
    this.commonService.apis$.subscribe(res => {
      if(res){
        this.baseUrl = res.adminIp;
        this.raceUrl = res.racingApi;
        this.sportUrl = res.sportApi;
        this.fancyUrl = res.fancyApi;
        // this.sportSocketApi = res.sportSocketApi.replace('http', 'ws');
        // this.racingSocketApi = res.racingSocketApi.replace('http', 'ws');

        if (location.protocol === 'https:') {
            this.raceUrl = res.sslRacingApi;
            this.sportUrl = res.sslSportApi;
            this.sportSocketApi = res.sslsportSocketApi;
            this.racingSocketApi = res.sslracingSocketApi;
        }
      }
    })
  }

  startOddsInterval(intervalTime) {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
    this.intervalSub = interval(intervalTime).subscribe(() => {
      if (!this.socketTimeOut) {
        this.getOdds(this.marketIds).subscribe((data) => {
          this._oddsSub.next(data);
        });
        this.getFancyOdds(this.marketId).subscribe((data: any) => {
          if (data.BMmarket) {
            this._oddsSub.next({ BMmarket: data.BMmarket });
          }
          if (data.Fancymarket) {
            this._oddsSub.next({ Fancymarket: data.Fancymarket[0] });
          }
        });
      }
    });
  }

  loadEvent(eventId: number) {
    return this.httpClient.get(`${this.baseUrl}/loadEvent/${eventId}`);
  }

  getFancyExposure(eventId) {
    return this.httpClient.get(`${this.baseUrl}/fancyExposure/${eventId}`);
  }

  getFancyBook(marketId, fancyId) {
    return this.httpClient.get(
      `${this.baseUrl}/listBooks/df_${marketId}_${fancyId},`
    );
  }

  getBookExposure(marketId) {
    return this.httpClient.get(`${this.baseUrl}/listBooks/${marketId}`)
  }

  marketDescription(marketId: string) {
    return this.httpClient.get(`${this.raceUrl}/marketDescription/${marketId}`);
  }

  getScore(matchBfId: string) {
    return this.httpClient.get(`${this.scoreUrl}/${matchBfId}`);
  }
  GetScoreId(eventId:number) {
    return this.httpClient.get(`https://sportbet.id/VRN/v1/api/scoreid/get?eventid=${eventId}`);
  }
  // getOdds(marketIds) {
  //   return this.httpClient.get(
  //     `http://209.250.242.175:33332/oddsInplay/?ids=${marketIds}`
  //   );
  // }

  // getFancyOdds(matchId) {
  //   return this.httpClient.get(
  //     `http://209.250.242.175:33332/fancyMarkets/${matchId}`
  //   );
  // }
  getOdds(marketIds) {
    return this.httpClient.get(
      `${this.sportUrl}/oddsInplay/?ids=${marketIds}`
    );
  }

  getFancyOdds(matchId) {
    return this.httpClient.get(
      `${this.fancyUrl}/${matchId}`
    );
  }



  // getWebSocketData(marketdata) {
  //   if (!marketdata.racing) {
  //     this.startOddsInterval(marketdata.inPlay == 1 ? 2000 : 10000);
  //     let ids = marketdata.markets.reduce((acc, c) => [...acc, c.bfId], []);
  //     this.marketIds = ids.join(',');
  //   }
  //   if (marketdata && marketdata.port && this.marketId !== marketdata.bfId) {
  //     this.marketId = marketdata.bfId;
  //     if (marketdata.racing) {
  //       var url = `${this.racingSocketApi}:${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'
  //         }`;
  //     } else {
  //       var url = `${this.sportSocketApi}:${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'
  //         }`;
  //     }

  //     if (!this.subject$ || this.subject$.CLOSED) {


  //       this.subject$ = this.createConnection(url);
  //       //console.log(this.subject$);

  //       this.subject$.onmessage = (message: any) => {
  //         message = JSON.parse(message.data);

  //         if (!marketdata.racing) {
  //           this.socketTimeOut = true;
  //           clearTimeout(this.timeOutOdds);
  //           this.timeOutOdds = setTimeout(
  //             () => {
  //               this.socketTimeOut = false;
  //             },
  //             marketdata.inPlay == 1 ? 3000 : 5000
  //           );
  //         }
  //         this._oddsSub.next(message);
  //       };
  //       // this.subject$.onerror = ((error: any) => {
  //       // console.log(`[error]: Error connecting to socket`);
  //       // this.marketId = null;
  //       // this.getWebSocketData(marketdata);
  //       // });
  //     }

  //   }
  //   return this.odds$;
  // }

  // getWebSocketDataTrack(marketdata) {
  //   if (!marketdata.racing) {
  //     this.startOddsInterval(marketdata.inPlay == 1 ? 2000 : 10000);
  //     let ids = marketdata.markets.reduce((acc, c) => [...acc, c.bfId], []);
  //     this.marketIds = ids.join(',');
  //   }
  //   if (marketdata && marketdata.port && this.marketId !== marketdata.bfId) {
  //     this.marketId = marketdata.bfId;
  //     if (marketdata.racing) {
  //       var url = `${this.racingSocketApi}:${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'
  //         }`;
  //     } else {
  //       var url = `${this.sportSocketApi}:${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'
  //         }`;
  //     }

  //     if (!this.subject$ || this.subject$.CLOSED) {
  //       this.subject$ = this.createConnection(url);
  //       //console.log(this.subject$);
  //      this.subject1$.push(this.subject$);
  //       this.subject$.onmessage = (message: any) => {
  //         message = JSON.parse(message.data);

  //         if (!marketdata.racing) {
  //           this.socketTimeOut = true;
  //           clearTimeout(this.timeOutOdds);
  //           this.timeOutOdds = setTimeout(
  //             () => {
  //               this.socketTimeOut = false;
  //             },
  //             marketdata.inPlay == 1 ? 3000 : 5000
  //           );
  //         }
  //         this._oddsSub.next(message);
  //       };
  //       // this.subject$.onerror = ((error: any) => {
  //       // console.log(`[error]: Error connecting to socket`);
  //       // this.marketId = null;
  //       // this.getWebSocketData(marketdata);
  //       // });
  //     }

  //   }
  //   return this.odds$;

  // }





  // getWebSocketData(marketdata) {
  //   if (!marketdata.racing) {
  //     this.startOddsInterval(marketdata.inPlay == 1 ? 2000 : 10000);
  //     let ids = marketdata.markets.reduce((acc, c) => [...acc, c.bfId], []);
  //     this.marketIds = ids.join(',');
  //   }
  //   if (marketdata && marketdata.port && this.marketId !== marketdata.bfId) {
  //     this.marketId = marketdata.bfId;
  //     if (marketdata.racing) {
  //       var url = `${this.racingSocketApi}:${marketdata.port}/${
  //         this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'
  //       }`;
  //     } else {
  //       var url = `${this.sportSocketApi}:${marketdata.port}/${
  //         this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'
  //       }`;
  //     }

  //     if (!this.subject$ || this.subject$.CLOSED) {
  //       this.subject$ = this.createConnection(url);

  //       this.subject$.onmessage = (message: any) => {
  //         message = JSON.parse(message.data);

  //         if (!marketdata.racing) {
  //           this.socketTimeOut = true;
  //           clearTimeout(this.timeOutOdds);
  //           this.timeOutOdds = setTimeout(
  //             () => {
  //               this.socketTimeOut = false;
  //             },
  //             marketdata.inPlay == 1 ? 3000 : 5000
  //           );
  //         }
  //         this._oddsSub.next(message);
  //       };
  //     }
  //     return this.odds$;
  //   }
  //   return this.odds$;
  // }

  createConnection(url) {
    return new WebSocket(url);
  }

  closeConnection() {
    if (this.subject$ && this.subject$.OPEN) {
      this.marketId = null;
      if (this.intervalSub) this.intervalSub.unsubscribe();
      this._oddsSub.next(null);
      this.subject$.close();
    }
  }

  closeConnectionfav() {
    this.marketId = null;
    if (this.intervalSub) this.intervalSub.unsubscribe();
    this._oddsSub.next(null);

    _.forEach(this.subject1$, function (ArraySubject) {
      // console.log(ArraySubject);
      if (ArraySubject && ArraySubject.OPEN) {
        ArraySubject.close();
      }

    });

  }



}
