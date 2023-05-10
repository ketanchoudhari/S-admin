import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ITransfer } from './types/transfer';

@Injectable({
  providedIn: 'root',
})
export class BankingService {
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
        this.baseUrl =  res.adminReport;;
      }
    });
  }

  transfer(data: ITransfer) {
    return this.httpClient.post(`${this.baseUrl}/transfert`, data);
  }

  // getlog(ID?: number): Observable<any> {
  //   if (!!ID) {
  //     return this.httpClient.get(`${this.baseUrl}/logTransaction/${ID}`);
  //   } else {
  //     return this.httpClient.get(`${this.baseUrl}/logTransaction`);
  //   }
  // }

  getlog(ID:number,page:number,size:number): Observable<any> {
    if (ID != 0) {
      return this.httpClient.get(`${this.baseUrl}/logTransaction?offset=${page}&limit=${size}&userId=${ID}`);
    } else {
      return this.httpClient.get(`${this.baseUrl}/logTransaction?offset=${page}&limit=${size}&userId=`);
    }
  }

  listUsers() {
    return this.httpClient.get(`${this.baseUrl}/banking`);
  }

  fullWithdrawal(data) {
    return this.httpClient.post(`${this.baseUrl}/fullWithdrawal`,data);
  }
}
