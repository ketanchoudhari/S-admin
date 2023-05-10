import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class SettlementService {
  baseUrl: string;
  constructor(private http: HttpClient,private router :Router, private commonService: CommonService) {
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }

  closedGames(date: string, sportId: string) {
    return this.http.get(
      `${this.baseUrl}/games?date=${date}&sportId=${sportId}`
    );
  }

  setResult(sportId: string, marketId: string) {
    // result?sportId=id&marketId=mid

    return this.http.get(
      `${this.baseUrl}/result?sportId=${sportId}&marketId=${marketId}`
    );
  }

  getVirtual(date: string) {
    return this.http.get(`${this.baseUrl}/virtualGames?date=${date}`);
  }

  settleVirtual(type, marketid, runsSelection) {
    return this.http.get(
      `${this.baseUrl}/settleVirtualGames?type=${type}&marketId=${marketid}&winner=${runsSelection}`
    );
  }

  voidBets(marketId) {
    return this.http.get(`${this.baseUrl}/void/${marketId}`);
  }

  getBmMarkets(date: string) {
    return this.http.get(`${this.baseUrl}/bmGames?date=${date}`);
  }

  settleTNPLBmMarket(marketId: string, result: number) {
    return this.http.get(
      `${this.baseUrl}/settleBmGame?marketId=${marketId}&winnerSelId=${result}`
    );
  }

  getkabaddiGames(date: string){
    return this.http.get(`${this.baseUrl}/kabaddiGames?date=${date}`);
  }

  settleKabaddiGames(type:string,marketId: string, result: number){
    return this.http.get(
      `${this.baseUrl}/settleKabaddiGames?type=${type}&marketId=${marketId}&winner=${result}`
    );
  }
}
