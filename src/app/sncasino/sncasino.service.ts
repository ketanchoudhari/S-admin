import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class SncasinoService {

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
  listCasinoSNBets(datefrom,dateto,page:number,limit:number,sportId:string) {
    return this.http.get(`${this.baseUrl}/listCasinoSNBets?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&sportId=${sportId}`);
  }
  listCasinoProviders() {
    return this.http.get(
      `${this.baseUrl}/listCasinoProviders`
    );
  }
  userCasinoProducts(userId:any) {
    return this.http.get(
      `${this.baseUrl}/listCasinoProviders/${userId}`
    );
  }
  activateCasinoProviders(params) {
    return this.http.post(`${this.baseUrl}/activateCasinoProviders`, params);
  }
  CasinoSNPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.http.get(`${this.baseUrl}/CasinoSNPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }

  casinoSNBetsHistory(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoSNBetsHistory?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }

  casinoSNProfitLoss(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoSNProfitLoss?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
}
