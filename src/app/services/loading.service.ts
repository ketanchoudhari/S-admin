import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loadingSub = new BehaviorSubject<boolean>(null);
  public loading$ = this._loadingSub.asObservable();
  constructor() { }

  setLoading(loading: boolean) {
    this._loadingSub.next(loading);
  }
}
