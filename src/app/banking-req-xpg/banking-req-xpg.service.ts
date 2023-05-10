import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ITransfer } from './types/transfer-req';

@Injectable({
  providedIn: 'root',
})
export class BankingReqXpgService {
  private baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private auth: AuthService,
    private commonService: CommonService,
    private router: Router

  ) {
    commonService.apis$.subscribe((res) => {
    if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminReport;
      }
    });
  }

  transfer(data: any) {
    return this.httpClient.post(`${this.baseUrl}/transfert`, data);
  }
  updateTrnrequest(data: any) {
    return this.httpClient.post(`https://api.cricpayz.io:15557/api/updateTrnrequest`, data);
  }

  getalltrnrequest(type:any,status:any,from:any,to:any) {
    return this.httpClient.get(`https://api.cricpayz.io:15557/api/getalltrnrequest?type=${type}&status=${status}&from=${from}&to=${to}`);
  }

}
