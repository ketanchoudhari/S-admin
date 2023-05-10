import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { ISetting } from './types/setting';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
    private router :Router
  ) {
    commonService.apis$.subscribe((res) => {
     if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }

  setSetting(data: ISetting) {
    return this.httpClient.post(`${this.baseUrl}/setSetting`, data);
  }

  setdefaultSetting(data : string){
    return this.httpClient.post(`${this.baseUrl}/resetSettings/${data}`,{});
  }

  listSetting(data: { typeWise: string; value: string; userId;sportId }) {
    return this.httpClient.get(
      `${this.baseUrl}/listSetting?typeWise=${data.typeWise}&value=${data.value}&userId=${data.userId}&sportId=${data.sportId}`
    );
  }
}
