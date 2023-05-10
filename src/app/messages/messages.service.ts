import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { MessagesCommentary, UpdateCommentary } from './models/commentary.model';
import { MessagesRules } from './models/rules.model';
import { MessagesTicker } from './models/ticker.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private baseUrl: string;
  constructor(private httpClient: HttpClient,
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

  changeTickers(tickers: MessagesTicker[]) {
    return this.httpClient.post(`${this.baseUrl}/ticker`, tickers);
  }

  listTickers() {
    return this.httpClient.get(`${this.baseUrl}/getTicker`);
  }

  changeRules(rules: MessagesRules) {
    return this.httpClient.post(`${this.baseUrl}/rules`, rules);
  }

  listRules() {
    return this.httpClient.get(`${this.baseUrl}/getRules`);
  }

  listComments(gameIds: string) {
    return this.httpClient.post(`${this.baseUrl}/getCommentary/${gameIds}`, {});
  }

  createCommentary(data: MessagesCommentary) {
    return this.httpClient.post(`${this.baseUrl}/commentary`, data);
  }

  changeCommentary(data: UpdateCommentary) {
    return this.httpClient.post(`${this.baseUrl}/updateCommentary`, data);
  }

  deleteCommentary(id: number) {
    return this.httpClient.post(`${this.baseUrl}/deleteCommentary/${id}`, {});
  }

  listGames() {
    return this.httpClient.get(`${this.baseUrl}/listGames/4`);
  }
}
