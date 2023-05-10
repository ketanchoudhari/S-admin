import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class BetlistService {
  baseUrl: string;
  livebetUrl:string;
  constructor(private http: HttpClient,   private router: Router
    , private commonService: CommonService) {
    commonService.apis$.subscribe((res) => {
     if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
        this.livebetUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;
        this.livebetUrl = res.booksLiveBets;
      }
    });
  }

  listLiveBets(eventId?: string,page?:number,limit?:number) {
    if (!!eventId) {
      // return this.http.get(`${this.livebetUrl}/liveBets/${eventId}`);
      return this.http.get(`${this.livebetUrl}/liveBets?status=0&offset=${page}&limit=${limit}&sport=&eventId=${eventId}&marketId=&stake=`);
    }
    // return this.http.get(`${this.livebetUrl}/liveBets?offset=${page}&limit=${limit}`);
    return this.http.get(`${this.livebetUrl}/liveBets`);
  }
  listLiveBets2(status: number,page:number,limit:number,sport:string,eventId:string,marketId:string,stake:number,user:any,currency:string) {
    return this.http.get(`${this.livebetUrl}/liveBets?status=${status}&offset=${page}&limit=${limit}&sport=${sport}&eventId=${eventId}&marketId=${marketId}&stake=${stake}&userId=${user?.userId ? user.userId:""}&currency=${currency}`);
  }

  listBets1(datefrom: string, dateto: string, status: number) {
    return this.http.get(
      `${this.baseUrl}/listBets?from=${datefrom}&to=${dateto}&status=${status}`
    );
  }
  userbyBetslist(from,to){
    return this.http.get(`${this.baseUrl}/listUserWithBets?from=${from}&to=${to}`)
  }
  listMarkets(eventid,datefrom,dateto) {
    return this.http.get(
      `${this.baseUrl}/marketList?eventId=${eventid}&from=${datefrom}&to=${dateto}`
    );
  }
  listMarkets2(eventid) {
    return this.http.get(
      `${this.baseUrl}/marketListLive?eventId=${eventid}`
    );
  }
  
  listBets(datefrom: string, dateto: string, status: number,page:number,limit:number,user:any,betid:string,marketId:string,eventId:string,sport:string,stake:number,currency:string,sort:string) {
    if(user?.t==8){
        return this.http.get(
          `${this.baseUrl}/listBets?from=${datefrom}&to=${dateto}&status=${status}&offset=${page}&limit=${limit}&playerId=${user.d}&consolidateId=${betid}&marketId=${marketId}&eventId=${eventId}&sport=${sport}&stake=${stake}&currency=${currency}&sort=${sort}`);
    }else{
        return this.http.get(
          `${this.baseUrl}/listBets?from=${datefrom}&to=${dateto}&status=${status}&offset=${page}&limit=${limit}&userId=${user?.d ? user.d:""}&consolidateId=${betid}&eventId=${eventId}&marketId=${marketId}&sport=${sport}&stake=${stake}&currency=${currency}&sort=${sort}`);
    }
  }

  cancelVoidBets(data: { betId: string }, type: number) {
    return this.http.post(
      `${this.baseUrl}/cancelVoidBets?status=${type}`,
      data
    );
  }

  listevent(datefrom,dateto) {
    return this.http.get(
      `${this.baseUrl}/eventlist?from=${datefrom}&to=${dateto}`
    );
  }
  listevent2() {
    return this.http.get(
      `${this.baseUrl}/eventlistLive`
    );
  }

  voidBets(data, type: number) {
    return this.http.post(`${this.baseUrl}/cancelVoidBets?status=${type}`,data);
  }
  livebets(data) {
    return this.http.post(`https://api.skybet369.co/pad=87/liveBets`,data);
  }
  settledbets(data) {
    return this.http.post(`https://api.skybet369.co/pad=87/settledBets`,data);
  }
}
