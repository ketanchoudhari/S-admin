import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AwcCasinoService {

  private baseUrl: string;
  private casinoUrl: string;

  constructor(private http: HttpClient, private common: CommonService) {
    common.apis$.subscribe((res) => {
      if (res) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl = res.adminIp;;
      }
      this.casinoUrl = res.casApi;
    });
  }
  casinoAWCPlReportByDownLine(datefrom: string, dateto: string) {
    return this.http.get(
      `${this.baseUrl}/casinoAWCPlReportByDownLine?from=${datefrom}&to=${dateto}`
    );
  }
  listCasinoAWCBets(userId:number,datefrom,dateto,consolidateId:string,userName:string,stake:number,sport:string) {
    return this.http.get(`${this.baseUrl}/listCasinoAWCBets?userId=${userId}&from=${datefrom}&to=${dateto}&consolidateId=${consolidateId}&userName=${userName}&stake=${stake}&sport=${sport}`);
  }
  listAWCCasinoPlatforms(userId:any) {
    return this.http.get(
      `${this.baseUrl}/listAWCCasinoPlatforms/${userId}`
    );
  }
  activateAWCCasinoPlatforms(params) {
    return this.http.post(`${this.baseUrl}/activateAWCCasinoPlatforms`, params);
  }
  CasinoAWCPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.http.get(`${this.baseUrl}/CasinoAWCPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }

  casinoAWCBetsHistory(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoAWCBetsHistory?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }

  casinoAWCProfitLoss(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoAWCProfitLoss?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
}
