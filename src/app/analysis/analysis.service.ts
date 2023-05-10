import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  baseUrl = environment.baseUrl;
  fancyApi;
  siteName=environment.siteName;
  isSkyFancy = environment.isSkyFancy;
  sslSportApi:string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
    private router: Router
  ) {
    commonService.apis$.subscribe((res) => {
      // this.baseUrl = res.devAdminIp;
      // this.baseUrl = res.devAdminIp;
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
        this.fancyApi = res.fancyApi;
        this.sslSportApi = res.sslSportApi;
      } else {
        this.baseUrl = res.booksLiveBets;
        this.fancyApi = res.fancyApi;
        this.sslSportApi = res.sslSportApi;
      }
    });
  }
  oddsInplay(marketId){
    return this.httpClient.get(`${this.sslSportApi}/oddsInplay/?ids=${marketId}`)
  }
  listBooks(eventId?: string) {
    if (eventId) {
      return this.httpClient.get(`${this.baseUrl}/listBooks/${eventId}`);
    }
    return this.httpClient.get(`${this.baseUrl}/listBooks`);
  }
  getBmFancy(eventId) {
    if(this.isSkyFancy){
      return this.httpClient.get(`${this.fancyApi}/api/bm_fancy/${eventId}/1`);
    }else{
      return this.httpClient.get(`${this.fancyApi}/api/bm_fancy/${eventId}/0`);
    }
  }
}
