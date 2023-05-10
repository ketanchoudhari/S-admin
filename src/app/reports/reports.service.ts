import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,   private router: Router

  ) {
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminReport;
      }
    });
  }

  loginLogout() {
    return this.httpClient.get(`${this.baseUrl}/logInOutReport`);
  }

  failedLogin() {
    return this.httpClient.get(`${this.baseUrl}/failedLogInReport`);
  }

  plReportByDownLine(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/plReportByDownLine?from=${datefrom}&to=${dateto}`
    );
  }

  plGlobalReportByDownLine(datefrom: string, dateto: string,userId:any) {
    return this.httpClient.get(
      `${this.baseUrl}/globalReport?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }

  casinoTPPlReportByDownLine(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoTPPlReportByDownLine?from=${datefrom}&to=${dateto}`
    );
  }

  casinoPlReportByDownLine(userId:any,datefrom: string,dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoPlReportByDownLine?userId=${userId}&from=${datefrom}&to=${dateto}`
    );
  }

  casinoSNPlReportByDownLine(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoSNPlReportByDownLine?from=${datefrom}&to=${dateto}`
    );
  }
  casinoSlotPlReportByDownLine(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoSlotPlReportByDownLine?from=${datefrom}&to=${dateto}`
    );
  }
  CasinoSNPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.httpClient.get(`${this.baseUrl}/CasinoSNPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }
  CasinoSlotPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.httpClient.get(`${this.baseUrl}/CasinoSlotPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }
  plReportByMarket(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/plReportByMarket?from=${datefrom}&to=${dateto}`
    );
  }
  ReportPokerLog(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/pokerLog?from=${datefrom}&to=${dateto}`
    );
  }

  newAccounts(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/newAccounts?from=${datefrom}&to=${dateto}`
    );
  }

  turnover(datefrom: string, dateto: string) {
    return this.httpClient.get(
      `${this.baseUrl}/turnover?from=${datefrom}&to=${dateto}`
    );
  }

  settleArc(
    userId: string,
    sport: string,
    from: string,
    to: string,
    description: string
  ) {
    return this.httpClient.get(
      `${this.baseUrl}/settelarc?userId=${userId}&sport=${sport}&from=${from}&to=${to}&description=${description}`
    );
  }

  rejectArc(userId: string, sport: string, from: string, to: string) {
    return this.httpClient.get(
      `${this.baseUrl}/rejectarc?from=${from}&to=${to}&userId=${userId}&sport=${sport}`
    );

    // return this.httpClient.get(`${this.baseUrl}/settelarc?userId=${userId}&sport=${sport}&from=${from}&to=${to}`)
  }

  onlineuser(){
    let url = `${this.baseUrl}/onlineUsers`;
    return this.httpClient.get(url)
    
  }

  CasinoBGPlReportByDownLine(datefrom: string, dateto: string,userId:any) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoBGPlReportByDownLine?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
  CasinoBGPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.httpClient.get(`${this.baseUrl}/CasinoBGPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }
}
