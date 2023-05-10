import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class UserSearchService {
  private baseUrl: string;
  private _searchTermSub = new Subject<string>();
  searchTerm$ = this._searchTermSub.asObservable();
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

  searchUser(term) {
    this._searchTermSub.next(term);
  }

  searchUserApi(userName: string) {
    return this.httpClient.get(`${this.baseUrl}/searchUser/${userName}`);
  }
}
