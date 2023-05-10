import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApis } from '../shared/types/apis';
import { GenericResponse } from '../shared/types/generic-response';
import { Hierarchy } from '../shared/types/hierarchy';
import { fullHierarchy } from '../users/models/user-list';
import { ShareDataService } from './share-data.service';
export const HIERARCY_LIST = 'hierarcy_list';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _balanceSub = new ReplaySubject<number>(1);
  balance$ = this._balanceSub.asObservable();

  private _hierarchyMapSub = new ReplaySubject<Map<number, Hierarchy>>(1);
  hierarchyMap$ = this._hierarchyMapSub.asObservable();

  private _hierarchyListSub = new ReplaySubject<Hierarchy[]>(1);
  hierarchyList$ = this._hierarchyListSub.asObservable();

  private _allUsersSub = new ReplaySubject<fullHierarchy>(1);
  _allUsersSub$ = this._allUsersSub.asObservable();

  private isPremiumSite = environment.isPremiumSite;
  // private apisUrl = (environment.isPremiumSite) ? environment.BDapisUrl : environment.apisUrl;
  private apisUrl = (environment.siteName == 'lc247') ? environment.BDapisUrl : environment.apisUrl;
  private isBdlevel = environment.isBdlevel;
  private isRental = environment.isRental;
  apis$ = new ReplaySubject<IApis>(1);
  apis: IApis;

  hierarchy;

  vrnlUserType: number;
  whitelabelUserType: number;
  adminUserType: number;
  subAdminUserType: number;
  superMasterUserType: number;
  masterUserType: number;
  agentUserType: number;
  clientUserType: number;

  defaultHierarchy = {
    vrnladmin: "vrnladmin",
    whitelabel: "whitelabel",
    admin: "admin",
    subadmin: "subadmin",
    supermaster: "supermaster",
    master: "master",
    agent: "agent",
    client: "client",
  }

  BdbetHierarchy = {
    vrnladmin: "vrnladmin",
    whitelabel: "whitelabel",
    admin: "admin",
    subadmin: "senior sub admin",
    supermaster: "sub admin",
    master: "super",
    agent: "master",
    client: "user",
  }

  sharingHierarchy = {
    vrnladmin: "vrnladmin",
    whitelabel: "mother panel",
    admin: "whitelabel",
    subadmin: "admin",
    supermaster: "sub admin",
    master: "super master",
    agent: "master",
    client: "user",
  }

  private baseUrl: string;
  userid: any = 0;
  userlist = [];
  usermainid: any;
  lastuser: any;
  constructor(private http: HttpClient, private router: Router, private SharedateService: ShareDataService
  ) {
    this.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl = res.adminIp;
      }
    });
    this.lastuser = localStorage.getItem('lastuser')
  }

  listHierarchy() {
    this.http
      .get(`${this.baseUrl}/listHierarchy`)
      .subscribe((res: GenericResponse<Hierarchy[][]>) => {
        if (res && res.errorCode === 0) {
          if (this.isPremiumSite && !this.isBdlevel && !this.isRental) {
            res.result[0].forEach(level => {
              level.name = this.BdbetHierarchy[level.name]
            })
          } else if (this.isPremiumSite && this.isBdlevel) {
            res.result[0].forEach(level => {
              level.name = this.sharingHierarchy[level.name]
            })
          } else if (!this.isPremiumSite && this.isBdlevel) {
            res.result[0].forEach(level => {
              level.name = this.sharingHierarchy[level.name]
            })
          } else if (this.isPremiumSite && this.isRental) {
            res.result[0].forEach(level => {
              level.name = this.defaultHierarchy[level.name]
            })
          }
          // console.log(res.result[0]);

          this._hierarchyListSub.next(res.result[0]);
        }
      });
  }
  loadfullHierarchy(userid: any = 0) {
    setTimeout(() => {
      this.http
        .get(`${this.baseUrl}/fullHierarchy?last=${userid}`)
        .subscribe((res: any) => {
          if (res && res.errorCode === 0) {
            this._allUsersSub.next(res.result);
            this.userlist = res.result;
            this.userid = this.userlist[this.userlist.length - 1];
            this.usermainid = this.userid?.userId
            // console.log(this.usermainid)
            localStorage.setItem('lastuser', this.usermainid);

          }
        });
    }, 15000);
  }
  fullHierarchy2(userid: any) {
    return this.http.get(`${this.baseUrl}/fullHierarchy?last=${userid}`);
  }
  get hierarchyMap(): Map<number, Hierarchy> {
    return this.hierarchy;
  }

  listAllHierarchy() {
    this.http
      .get(`${this.baseUrl}/listAllHierarchy`)
      .subscribe((res: GenericResponse<Hierarchy[][]>) => {
        if (res && res.errorCode === 0) {

          if (this.isPremiumSite && !this.isBdlevel && !this.isRental) {
            res.result[0].forEach(level => {
              level.name = this.BdbetHierarchy[level.name]
            })

            let hierarchyMap = new Map<number, Hierarchy>(
              res.result[0].map((x) => [x.id, x] as [number, Hierarchy])
            );
            // console.log(hierarchyMap);
            let heirarchyList = Array.from(hierarchyMap);
            // console.log(heirarchyList);
            this.vrnlUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'vrnladmin';
            })[0];

            this.whitelabelUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'whitelabel';
            })[0];

            this.adminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'admin';
            })[0];

            this.subAdminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'senior sub admin';
            })[0];

            this.superMasterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'sub admin';
            })[0];

            this.masterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'super';
            })[0];

            this.agentUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'master';
            })[0];

            this.clientUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'user';
            })[0];

            this.hierarchy = hierarchyMap;
            // this.cookieService.set(HIERARCY_LIST, JSON.stringify(hierarchyMap));
            this._hierarchyMapSub.next(hierarchyMap);
          } else if (this.isPremiumSite && this.isBdlevel) {
            res.result[0].forEach(level => {
              level.name = this.sharingHierarchy[level.name]
            })

            let hierarchyMap = new Map<number, Hierarchy>(
              res.result[0].map((x) => [x.id, x] as [number, Hierarchy])
            );
            // console.log(hierarchyMap);
            let heirarchyList = Array.from(hierarchyMap);
            // console.log(heirarchyList);
            this.vrnlUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'vrnladmin';
            })[0];

            this.whitelabelUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'mother panel';
            })[0];

            this.adminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'whitelabel';
            })[0];

            this.subAdminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'admin';
            })[0];

            this.superMasterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'sub admin';
            })[0];

            this.masterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'super master';
            })[0];

            this.agentUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'master';
            })[0];

            this.clientUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'user';
            })[0];

            this.hierarchy = hierarchyMap;
            // this.cookieService.set(HIERARCY_LIST, JSON.stringify(hierarchyMap));
            this._hierarchyMapSub.next(hierarchyMap);
          } else if (!this.isPremiumSite && this.isBdlevel) {
            res.result[0].forEach(level => {
              level.name = this.sharingHierarchy[level.name]
            })

            let hierarchyMap = new Map<number, Hierarchy>(
              res.result[0].map((x) => [x.id, x] as [number, Hierarchy])
            );
            // console.log(hierarchyMap);
            let heirarchyList = Array.from(hierarchyMap);
            // console.log(heirarchyList);
            this.vrnlUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'vrnladmin';
            })[0];

            this.whitelabelUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'mother panel';
            })[0];

            this.adminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'whitelabel';
            })[0];

            this.subAdminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'admin';
            })[0];

            this.superMasterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'sub admin';
            })[0];

            this.masterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'super master';
            })[0];

            this.agentUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'master';
            })[0];

            this.clientUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'user';
            })[0];

            this.hierarchy = hierarchyMap;
            // this.cookieService.set(HIERARCY_LIST, JSON.stringify(hierarchyMap));
            this._hierarchyMapSub.next(hierarchyMap);
          } else if (this.isPremiumSite && this.isRental) {
            res.result[0].forEach(level => {
              level.name = this.defaultHierarchy[level.name]
            })
            let hierarchyMap = new Map<number, Hierarchy>(
              res.result[0].map((x) => [x.id, x] as [number, Hierarchy])
            );
            // console.log(hierarchyMap);
            let heirarchyList = Array.from(hierarchyMap);
            // console.log(heirarchyList);
            this.vrnlUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'vrnladmin';
            })[0];

            this.whitelabelUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'whitelabel';
            })[0];

            this.adminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'admin';
            })[0];

            this.subAdminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'subadmin';
            })[0];

            this.superMasterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'supermaster';
            })[0];

            this.masterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'master';
            })[0];

            this.agentUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'agent';
            })[0];

            this.clientUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'client';
            })[0];

            this.hierarchy = hierarchyMap;
            // this.cookieService.set(HIERARCY_LIST, JSON.stringify(hierarchyMap));
            this._hierarchyMapSub.next(hierarchyMap);
          } else {
            let hierarchyMap = new Map<number, Hierarchy>(
              res.result[0].map((x) => [x.id, x] as [number, Hierarchy])
            );
            // console.log(hierarchyMap);
            let heirarchyList = Array.from(hierarchyMap);
            // console.log(heirarchyList);
            this.vrnlUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'vrnladmin';
            })[0];

            this.whitelabelUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'whitelabel';
            })[0];

            this.adminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'admin';
            })[0];

            this.subAdminUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'subadmin';
            })[0];

            this.superMasterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'supermaster';
            })[0];

            this.masterUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'master';
            })[0];

            this.agentUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'agent';
            })[0];

            this.clientUserType = heirarchyList.find(([k, v]) => {
              return v.name === 'client';
            })[0];

            this.hierarchy = hierarchyMap;
            // this.cookieService.set(HIERARCY_LIST, JSON.stringify(hierarchyMap));
            this._hierarchyMapSub.next(hierarchyMap);
          }
          // console.log(res.result[0]);
        }
      });
  }

  updateBalance() {
    this.http
      .get(`${this.baseUrl}/balance`)
      .subscribe((res: GenericResponse<{ balance: number }[]>) => {
        if (res && res.errorCode === 0) {
          this._balanceSub.next(res.result[0].balance);
        }
      });
  }

  getApis() {
    return this.http.get(`${this.apisUrl}`);
  }

  fanybooklist() {
    let url = `http://103.228.114.32:52135/fanybooklist`;
    return this.http.get(url)

  }


  bookmaking() {
    let url = `http://103.228.114.32:52134/bookmaking`;
    return this.http.get(url)

  }
  getlanguage() {
    return this.http.get('/../assets/language.json');
  }
}