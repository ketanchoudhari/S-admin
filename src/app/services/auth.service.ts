import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CurrentUser } from '../shared/models/current-user';
import { CommonService } from './common.service';
import { TokenService } from './token.service';

export const CURRENT_USER = 'current_user';
export const SHARING = 'sharing';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string;
  private isPremiumSite = environment.isPremiumSite;
  currentAuthState = true;

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  public currentUser: CurrentUser = null;
  currentUser$ = new BehaviorSubject<CurrentUser>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private commonService: CommonService,   private router: Router

  ) {
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        // console.log(this.router.url,'this url');
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
    if (cookieService.check(CURRENT_USER)) {
      this.currentUser = JSON.parse(cookieService.get(CURRENT_USER));
      this.currentUser$.next(this.currentUser);
    }
  }

  login(userData: any): Observable<{
    errorCode: number;
    errorDescription: string | null;
    result: Array<any>;
  }> {
    return this.http.post<{
      errorCode: number;
      errorDescription: string | null;
      result: Array<any>;
    }>(`${this.baseUrl}/login`, userData);
  }

  setLoggedIn(loggedIn: boolean) {
    if (this.currentAuthState !== loggedIn) {
      this._isLoggedIn.next(loggedIn);
      this.currentAuthState = loggedIn;
    }
  }

  setCurrentUser(user: CurrentUser) {
    this.currentUser = user;
    this.currentUser$.next(user);
    this.cookieService.set(CURRENT_USER, JSON.stringify(user));
  }

  checkIsLoggedIn() {
    return this.tokenService.check();
  }

  getCaptcha() {
    if(this.isPremiumSite){
      return this.http.get(`https://111111.info/pad=81/img.png/`);
    }else{
      return this.http.get(`${this.baseUrl}/img.png/`);
    }
  }

  logout() {
    this.http.get(`${this.baseUrl}/logout`).subscribe((res) => {
      this.tokenService.delete();
      this.setLoggedIn(false);
      this.setCurrentUser(null);
    });
  }
}
