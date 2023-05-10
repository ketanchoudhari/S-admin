import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class SelectsportsService {
  private baseUrl: string;
  constructor(private httpClient: HttpClient,
    private commonService: CommonService,private router :Router) { 
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
         this.baseUrl = res.devAdminIp;
       } else {
         this.baseUrl =  res.adminIp;;
       }
     });
  }

  listSports(selectedUid?: number) {
    if (selectedUid) {
      return this.httpClient.get(
        `${this.baseUrl}/listSports/${selectedUid}`
      );
    } else {
      return this.httpClient.get(`${this.baseUrl}/listSports`);
    }
  }

  activateSports(params) {
    return this.httpClient.post(`${this.baseUrl}/activateSports`, params);
  }
}
