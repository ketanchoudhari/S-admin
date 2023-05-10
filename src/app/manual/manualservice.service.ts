import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ManualserviceService {
  private baseUrl: any;

  constructor(private httpClient: HttpClient,private commonService: CommonService,   private router: Router) { 
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;
      }
    });
  }

  pendingFancy() {
    return this.httpClient.get(`${this.baseUrl}/pendingFancy`);
  }

  updateFancyStatus(gameid) {
    return this.httpClient.get(`${this.baseUrl}/updateFancyStatus/${gameid}`);
  }

  addFancyMarket(fancydata) {
    return this.httpClient.get(`${this.baseUrl}/addFancyMarket?eventId=${fancydata.eventId}&marketName=${fancydata.marketName}&sid=${fancydata.sid}`,{});
  }

}
