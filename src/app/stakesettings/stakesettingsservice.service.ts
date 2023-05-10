import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class StakesettingsserviceService {
  baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
  ) { 
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
         this.baseUrl = res.devAdminIp;
       } else {
         this.baseUrl =  res.adminIp;
       }
     });
  }

  setStakeSetting(data: String) {
    return this.httpClient.post(`${this.baseUrl}/stakeSetting/${data}`,{});
  }

}
