import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from '../users/models/user.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable({
  providedIn: 'root',
})
export class ShareUserService {
  private _userSubject = new ReplaySubject<User>(1);


  private _betSlipData = new BehaviorSubject<any>(null);
  betSlipData$ = this._betSlipData.asObservable();
  
  private _updateFundExpoSub = new BehaviorSubject<any>(null);
  updateFundExpo$ = this._updateFundExpoSub.asObservable();

  private _stakeButton = new BehaviorSubject<any>(null);
  stakeButton$ = this._stakeButton.asObservable();

  private _casinoList = new BehaviorSubject<any>(null);
  casinoList$ = this._casinoList.asObservable();

  private _callTpExpo = new BehaviorSubject<any>(null);
  callTpExpo$ = this._callTpExpo.asObservable();

  constructor() {}

  get user$() {
    return this._userSubject.asObservable();
  }
  
  shareCasinoList(data: any) {
    this._casinoList.next(data);
  }

  setUser(user: User) {
    this._userSubject.next(user);
  }

  shareStakeButton(data: any) {
    this._stakeButton.next(data);
  }

  shareUpdateFundExpo(data: any) {
    this._updateFundExpoSub.next(data);
  }
  shareCallTpExpoData(data: any) {
    this._callTpExpo.next(data);
  }
  shareBetSlipData(data: any) {
    this._betSlipData.next(data);
  }
}
