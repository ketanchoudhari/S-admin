import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { IChangePass } from './shared/types/change-pass';

@Injectable({
  providedIn: 'root',
})
export class MyAccountService {
  baseUrl: string;
  constructor(private http: HttpClient,   private router: Router
    , private commonService: CommonService) {
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }

  logActivity(page,size) {
    return this.http.get(`${this.baseUrl}/logActivity?offset=${page}&limit=${size}`);
  }

  changePassword(userData: IChangePass) {
    return this.http.post(
      `${this.baseUrl}/updateUser/${userData.userId}`,
      userData
    );
  }

  getUser(userId: number) {
    return this.http.get(`${this.baseUrl}/getUser/${userId}`);
  }
}
