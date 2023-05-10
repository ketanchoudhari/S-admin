import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class RacesService {
  baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,   private router: Router

  ) {
    commonService.apis$.subscribe((res) => {
     if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }

  listRaces(selectedUid?: number) {
    if (selectedUid) {
      return this.httpClient.get(`${this.baseUrl}/listRaces/${selectedUid}`);
    } else {
      return this.httpClient.get(`${this.baseUrl}/listRaces`);
    }
  }

  activateRace(params) {
    return this.httpClient.post(`${this.baseUrl}/activateRace`, params);
  }
}
