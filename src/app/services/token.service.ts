import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const AUTH_TOKEN = 'AuthToken';
export const LANGUAGE = 'LANGUAGE';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private cookie: CookieService) {}

  set(token: string) {
    this.cookie.set(AUTH_TOKEN, token);
  }

  get() {
    return this.cookie.get(AUTH_TOKEN);
  }

  getToken() {
    if (this.getLocalToken()) {
      return this.getLocalToken();
    } 
  }

  getLocalToken() {
    return localStorage.getItem(AUTH_TOKEN);
  }

  delete() {
    this.cookie.delete(AUTH_TOKEN);
  }

  check() {
    return this.cookie.check(AUTH_TOKEN);
  }
  setLanguage(lang){
    localStorage.setItem(LANGUAGE, lang);
  }
  getLanguage() {
    return localStorage.getItem(LANGUAGE);
  }
}
