import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { EnvService } from 'src/app/env.service';
import { AuthService } from 'src/app/services/auth.service';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { environment } from 'src/environments/environment';
export class TotalRow {
  constructor(
    public Totalpnl: number = 0
  ) {}
}
@Component({
  selector: 'app-slotcasinobets',
  templateUrl: './slotcasinobets.component.html',
  styleUrls: ['./slotcasinobets.component.scss']
})
export class SlotcasinobetsComponent implements OnInit {
  timeFormat = environment.timeFormat;
  siteName = environment.siteName;

  toTimeinput: boolean = false;
  totalRow = new TotalRow();
  fromDate;
  fromTime;
  toDate;
  toTime;
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  etglist: any = [];
  etglistCount: any = 0;
  p: number = 1;
  n: number = 10;
  selectPagelimit = "10";
  searchsportId: string=""
  prevousCount: number;
  currentUser: CurrentUser;

  heirarchyMap = {
    2: 'WL ID',
    3: 'AD ID',
    4: 'SA ID',
    5: 'SM ID',
    6: 'MA ID',
    7: 'AG ID',
  };
  month;
  totalPL: any;
  isBdlevel=environment.isBdlevel;
  Update: any;
  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private datePipe: DatePipe,
    private envService: EnvService,
    private shareService: ShareDataService,
    private casino: CasinoApiService,
    public commonService: CommonService,) { 
      this.toTimeinput = this.envService.environment.toTimeinput;
      this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
      this.dateConfig = {
        format: 'YYYY-MM-DD',
        min: this.month,
      };

  
      this.fromDate = datePipe.transform(
        new Date().setDate(new Date().getDate() - 1),
        'yyyy-MM-dd'
      );
        this.fromTime = datePipe.transform(
          new Date().setHours(0, 0, 0),
          'HH:mm:ss'
        );
      
  
      this.toDate = datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd');
      this.toTime = datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss');
  
      this.timeConfig = {
        hours24Format: 'hh',
        showSeconds: true,
      };
      if(this.isBdlevel){
        this.heirarchyMap = {
          2: 'MP ID',
          3: 'WL ID',
          4: 'AD ID',
          5: 'SA ID',
          6: 'SM ID',
          7: 'MA ID',
        };
      }
    }

  ngOnInit(): void {
    this.getlanguages();
    this.commonService.apis$.subscribe((res) => {
      this.SoltCasino()

    });
    this.currentUser = this.authService.currentUser;
    this.commonService.hierarchyMap$.subscribe((res) => {
      if (
        this.currentUser.userType !== this.commonService.vrnlUserType &&
        this.currentUser.userType !== this.commonService.whitelabelUserType &&
        this.currentUser.userType !== this.commonService.adminUserType
      ) {

      }
    });
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
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
  SoltCasino() {
    this.loadingService.setLoading(true);
    this.casino.listCasinoSlotBets(  
       `${this.fromDate} ${this.fromTime}`,
    `${this.toDate} ${this.toTime}`,this.p, this.n, this.searchsportId).subscribe((res: any) => {
      this.etglist = res.result.slice(1);
      this.totalRow = new TotalRow();
      res.result.slice(1).forEach((bet) => {
            this.totalRow.Totalpnl += bet.PL;
      });
      this.etglistCount = res.result[0].count;
      this.totalPL= res.result[0].totalPL;
      this.etglist?.forEach((user: any) => {
        if (user?.status == 0) {
          user.status = 'Open';
          console.log(user.name)
        }
        if (user?.status == 1) {
          user.status = 'Settled';
        }
        if (user?.status == 2) {
          user.status = 'Cancelled';
        }
        if (user?.status == 3) {
          user.status = 'Voided';
        }
      })
      if (this.etglistCount != this.prevousCount) {
        this.selectPagelimit = "10";
      }
      this.loadingService.setLoading(false);
    })
  }
  filterBybetId(term?: string) {
    this.p=1;
    // this.SNCasino()
  }
  selectNoRows(event) {
    console.log(event.target.value)
    this.p = 1;
    this.n = +event.target.value;
    this.SoltCasino();
  }
  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }
  pageChanged(event) {
    this.p = event;
    this.SoltCasino()
  }
  trackByIndex(index) {
    return index;
  }
}
