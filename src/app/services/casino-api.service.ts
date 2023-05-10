import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CasinoApiService {

  private baseUrl: string;
  private casinoUrl: string;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  casinoRate(gtype: string) {
    let url = `${this.casinoUrl}/api/d_rate/${gtype}`;
    return this.http.get(url)
  }

  lastResult(gtype: string) {
    let url = `${this.casinoUrl}/api/l_result/${gtype}`;
    return this.http.get(url)

  }

  roundResult(gtype: string, roundId: number) {
    let url = `${this.casinoUrl}/api/r_result/${gtype}/${roundId}`;
    return this.http.get(url)

  }

  loadTable(casinoType) {
    return this.http.get(`${this.baseUrl}/loadTable/${casinoType}`);
  }

  placeTpBet(data: any) {
    return this.http.post(`${this.baseUrl}/TPplaceBets`, data
    );
  }

  listBooks(tableName: string, roundId: any, selectionId: any) {
    let url = `${this.baseUrl}/listBooks/${tableName}/${roundId}/${selectionId}`;
    return this.http.get(url)
  }


  listTeenpatti(){
    let url = `${this.baseUrl}/listCasinoTable`;
    return this.http.get(url)
  
  }

  activeCasino(params) {
    return this.http.post(`${this.baseUrl}/activateCasinoTable`, params);
  }

  ETGCasino(datefrom,dateto,page:number,limit:number,sportId:string) {
    return this.http.get(`${this.baseUrl}/listCasinoBets?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&sportId=${sportId}`);
  }
  ETGCasinopnl(datefrom,dateto,page:number,limit:number,userId:any,operatotId:string) {
    if(operatotId==""){
      return this.http.get(`${this.baseUrl}/CasinoPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
    }else{
      return this.http.get(`${this.baseUrl}/CasinoPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}&operatorId=${operatotId}`);
    }
  }

  casinobetHistory(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoBetsHistory?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }

  casinoprofitLoss(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoProfitLoss?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
  ListCasinoProducts() {
    return this.http.get(
      `${this.baseUrl}/listCasinoProducts`
    );
  }
  userCasinoProducts(userId:any) {
    return this.http.get(
      `${this.baseUrl}/listCasinoProducts/${userId}`
    );
  }
  ActivateCasinoProducts(params) {
    return this.http.post(`${this.baseUrl}/activateCasinoProducts`, params);
  }

  //slot report api//
  ListCasinoCategories() {
    return this.http.get(
      `${this.baseUrl}/listCasinoCategories`
    );
  }
  userCasinoCategories(userId:any) {
    return this.http.get(
      `${this.baseUrl}/listCasinoCategories/${userId}`
    );
  }
  ActivateCasinoCategories(params) {
    return this.http.post(`${this.baseUrl}/activateCasinoCategories`, params);
  }
  listCasinoSlotBets(datefrom,dateto,page:number,limit:number,sportId:string) {
    return this.http.get(`${this.baseUrl}/listCasinoSlotBets?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&sportId=${sportId}`);
  }
  CasinoSlotPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.http.get(`${this.baseUrl}/CasinoSlotPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }
  CasinoSlotBetsHistory(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoSlotBetsHistory?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
  CasinoSlotProfitLoss(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoSlotProfitLoss?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }


  ListBGCasinoGames() {
    return this.http.get(
      `${this.baseUrl}/listBGCasinoGames`
    );
  }
  UserlistBGCasinoGames(userId:any) {
    return this.http.get(
      `${this.baseUrl}/listBGCasinoGames/${userId}`
    );
  }
  ActivateBGCasinoGames(params) {
    return this.http.post(`${this.baseUrl}/activateBGCasinoGames`, params);
  }

  CasinoBGBetsHistory(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoBGBetsHistory?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
  CasinoBGProfitLoss(datefrom: string, dateto: string, userId: number) {
    return this.http.get(
      `${this.baseUrl}/casinoBGProfitLoss?from=${datefrom}&to=${dateto}&userId=${userId}`
    );
  }
  listCasinoBGBets(datefrom,dateto,page:number,limit:number,sportId:string) {
    return this.http.get(`${this.baseUrl}/listCasinoBGBets?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&sportId=${sportId}`);
  }
  CasinoBGPnl(datefrom,dateto,page:number,limit:number,userId:number) {
    return this.http.get(`${this.baseUrl}/CasinoBGPnl?from=${datefrom}&to=${dateto}&offset=${page}&limit=${limit}&userId=${userId}`);
  }

}
