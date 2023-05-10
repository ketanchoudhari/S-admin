import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { environment } from 'src/environments/environment';
import { ReportsService } from '../reports.service';
import { ILogin } from '../types/login';

@Component({
  selector: 'app-loginlogout',
  templateUrl: './loginlogout.component.html',
  styleUrls: ['./loginlogout.component.scss'],
})
export class LoginlogoutComponent implements OnInit {
  p: number = 1;
  n: number = 10;
  selectedTabIndex: number = 0;
  loginList: ILogin[];
  logoutList: ILogin[];
  failedLoginList: ILogin[];

  loginStatusMap = {
    1: 'Login Successful',
    0: 'Login Failed',
    2: 'Logout',
  };
  currnetUser: CurrentUser;
  Update: any;
  constructor(
    private reportsService: ReportsService,
    private loadingService: LoadingService,
    private authservice: AuthService,
    private commonService: CommonService,
    private shareService: ShareDataService
  ) {}

  timeFormat = environment.timeFormat;
  ngOnInit(): void {
    this.getlanguages();
    this.currnetUser = this.authservice.currentUser;
  //  console.log(this.currnetUser);
    this.commonService.apis$.subscribe((res) => {
      this.getLogintReport();
    });
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }

  selectNoRows(numberOfRows: number) {
    this.p = 1;
    this.n = +numberOfRows;
  }

  getLogintReport() {
    this.loadingService.setLoading(true);
    this.reportsService
      .loginLogout()
      .subscribe((res: GenericResponse<ILogin[]>) => {
        this.loginList = [];
        this.logoutList = [];
        this.failedLoginList = [];
        if (res.errorCode === 0) {
          res.result = res.result.sort((a, b) => {
            return Date.parse(b.loginTime) - Date.parse(a.loginTime);
          });

          // res.result = res.result.map(res => res.loginTime=(new Date(res.loginTime).toLocaleString("en-US", {timeZone: "Asia/Kolkata"})));

          //   //  console.log(new Date('2021-06-18T18:01:00Z').toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));  convert to indian time statndard
          // VM2801:1 6/18/2021, 11:31:00 PM

          res.result.forEach((login) => {
            // login.loginTime= (new Date(login.loginTime).toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

            switch (login.loginStatus) {
              case 0:
                this.failedLoginList.push(login);
                break;
              case 1:
                this.loginList.push(login);
                break;
              case 2:
                this.logoutList.push(login);
                break;
            }
          });
        }

        this.loadingService.setLoading(false);
      });
  }

  selectTab(tabIndex) {
    this.selectedTabIndex = tabIndex;
    this.p = 0;
  }
}
