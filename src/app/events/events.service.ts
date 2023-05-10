import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
    private router: Router

  ) {
    commonService.apis$.subscribe((res) => {
     if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }

  listGame() {
    return this.httpClient.get(`${this.baseUrl}/listGames`);
  }

  activateListGame() {
    return this.httpClient.get(`${this.baseUrl}/listActiveGames`);
  }

  getGame(selctedGid: number) {
    return this.httpClient.get(`${this.baseUrl}/listGames/${selctedGid}`);
  }

  activeGame(gameIds) {
    return this.httpClient.post(`${this.baseUrl}/activateGames`, gameIds);
  }

  excludeGames(gameIds) {
    return this.httpClient.post(`${this.baseUrl}/excludeGames`, gameIds);
  }

  ReverseInplayGames(gameIds) {
    return this.httpClient.post(`${this.baseUrl}/ReverseInplayGames`, gameIds);
  }

  inplayGames(gameIds: number[]) {
    return this.httpClient.post(`${this.baseUrl}/inplayGames`, gameIds);
  }

  activateFancy(fancyData,source) {
    return this.httpClient.post(`${this.baseUrl}/activateFancy/${source}`, fancyData);
  }

  deactivateFancy(fancyData,source) {
    return this.httpClient.post(`${this.baseUrl}/deactivateFancy/${source}`, fancyData);
  }

  activatePremium(PremiumData) {
    return this.httpClient.post(`${this.baseUrl}/activatePremium`, PremiumData);
  }

  deactivatePremium(PremiumData) {
    return this.httpClient.post(`${this.baseUrl}/deactivatePremium`, PremiumData);
  }

  activateMO(matchoddData) {
    return this.httpClient.post(`${this.baseUrl}/activateMOMarket`, matchoddData);
  }

  deactivateMO(matchOddData) {
    return this.httpClient.post(`${this.baseUrl}/deactivateMOMarket`, matchOddData);
  }


  activateOU(OverUnderData) {
    return this.httpClient.post(`${this.baseUrl}/activateOUMarket`, OverUnderData);
  }

  deactivateOU(OverUnderData) {
    return this.httpClient.post(`${this.baseUrl}/deactivateOUMarket`, OverUnderData);
  }

  activateTM(TiedMarketData) {
    return this.httpClient.post(`${this.baseUrl}/activateTiedMarket`, TiedMarketData);
  }

  deactivateTM(TiedMarketData) {
    return this.httpClient.post(`${this.baseUrl}/deactivateTiedMarket`, TiedMarketData);
  }

  activateTossM(TiedMarketData) {
    return this.httpClient.post(`${this.baseUrl}/activateTossMarket`, TiedMarketData);
  }

  deactivateTossM(TiedMarketData) {
    return this.httpClient.post(`${this.baseUrl}/deactivateTossMarket`, TiedMarketData);
  }

  deactivateBM(bmData,source) {
    return this.httpClient.post(`${this.baseUrl}/deactivateBm//${source}`, bmData);
  }

  activateBM(bmData,source) {
    return this.httpClient.post(`${this.baseUrl}/activateBm/${source}`, bmData);
  }

  activateDraw(fancyData) {
    return this.httpClient.post(`${this.baseUrl}/activateDraw`, fancyData);
  }

  deactivateDraw(fancyData) {
    return this.httpClient.post(`${this.baseUrl}/deactivateDraw`, fancyData);
  }

  suspendBets(sportId, eventId) {
    return this.httpClient.get(
      `${this.baseUrl}/lockBets/${sportId}/${eventId}`
    );
  }

  acceptBets(sportId, eventId) {
    return this.httpClient.get(
      `${this.baseUrl}/unlockBets/${sportId}/${eventId}`
    );
  }

  listVirtualGames() {
    return this.httpClient.get(`${this.baseUrl}/listVirtualGames`);
  }

  stopFancy(eventId) {
    return this.httpClient.get(`${this.baseUrl}/stopFancy/${eventId}`);
  }

  startFancy(eventId) {
    return this.httpClient.get(`${this.baseUrl}/runFancy/${eventId}`);
  }

  closeEvent(sportId, eventId) {
    return this.httpClient.get(`${this.baseUrl}/${sportId}/${eventId}`);
  }
  Loackallbets() {
    return this.httpClient.get(`${this.baseUrl}/lockAllBets`);
  }
  Unlockallbets() {
    return this.httpClient.get(`${this.baseUrl}/unlockAllBets`);
  }
  LockTransfer() {
    return this.httpClient.get(`${this.baseUrl}/lockTransfer`);
  }
  UnlockTransfer() {
    return this.httpClient.get(`${this.baseUrl}/unlockTransfer`);
  }
  BetTransferStatus() {
    return this.httpClient.get(`${this.baseUrl}/betTransferStatus`);
  }
  lockRunner(data){
    return this.httpClient.post(`${this.baseUrl}/lockRunner`,data);
  }
}
