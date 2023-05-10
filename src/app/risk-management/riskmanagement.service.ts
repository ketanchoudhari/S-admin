import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class RiskmanagementService {
  private baseUrl: any;
  private fancyApi:any;
  private livebetUrl :string;
  private sslSportApi: any;
  siteName=environment.siteName;
  isPremiumSite=environment.isPremiumSite;
  isSkyFancy = environment.isSkyFancy;
  constructor(private httpClient: HttpClient,private commonService: CommonService,   private router: Router) { 
    commonService.apis$.subscribe((res) => {
      console.log(res);
      
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
        this.fancyApi = res.fancyApi;
        this.sslSportApi = res.sslSportApi;
      } else {
        this.baseUrl =  res.adminIp;
        this.livebetUrl = res.booksLiveBets;
        this.fancyApi = res.fancyApi;
        this.sslSportApi = res.sslSportApi;
      }
    });
  }

  cheaters(betid) {
    return this.httpClient.get(`https://www.555555.info/cheaters?betId=${betid}`);
  }

  listCheaters(from,to,time,sport,player,betid) {
    return this.httpClient.get(`https://www.555555.info/listCheaters?from=${from}&to=${to}&time=${time}&sport=${sport}&player=${player}&betId=${betid}`);
  }

  oddsInplay(marketId){
    return this.httpClient.get(`${this.sslSportApi}/oddsInplay/?ids=${marketId}`)
  }

  listBooks(eventId?: string) {
    if (eventId) {
      return this.httpClient.get(`${this.livebetUrl}/listBooks/${eventId}`);
    }
    return this.httpClient.get(`${this.livebetUrl}/listBooks`);
  }
  getBmFancy(eventId) {
    if(this.isPremiumSite && this.isSkyFancy){
      return this.httpClient.get(`${this.fancyApi}/api/bm_fancy/${eventId}/1`);
    }else{
      return this.httpClient.get(`${this.fancyApi}/api/bm_fancy/${eventId}/1`);
    }
  }
  top10Exposure() {
    return this.httpClient.get(`${this.baseUrl}/top10Exposure`);
  }
  top10Bets() {
    return this.httpClient.get(`${this.baseUrl}/top10Bets`);
  }
  fancyPnl(eventId,from,to) {
    return this.httpClient.get(`${this.baseUrl}/fancyPnl?eventId=${eventId}&from=${from}&to=${to}`);
  }

}