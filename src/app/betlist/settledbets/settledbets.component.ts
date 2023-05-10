import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

import { BetlistService } from '../betlist.service'
export class TotalRow {
  constructor(
    public Totalpnl: number = 0
  ) { }
}
@Component({
  selector: 'app-settledbets',
  templateUrl: './settledbets.component.html',
  styleUrls: ['./settledbets.component.scss']
})
export class SettledbetsComponent implements OnInit {
  timeFormat = environment.timeFormat;
  fromDate;
  fromTime;
  toDate;
  toTime;

  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  month
  token: string;
  livebetlist: any=[];
  p: number = 1;
  n: number = 20;
  statusList = [
    { id: 4, name: 'All' },
    { id: 1, name: 'Settled' },
    { id: 2, name: 'Cancelled' },
    { id: 3, name: 'Voided' },
  ];
  selectPagelimit = "10";
  searchbetId: string = '';
  searchUsername: any = "";
  fullHirarchySub: Subscription;
  usersList = [];
  searcheventtId: any=0;
  searchmarkettId: any="";
  
  totalRow = new TotalRow();
  constructor(private betlistService: BetlistService, private datePipe: DatePipe,
    public commonService: CommonService, 
    private loadingService: LoadingService,
    private tokenService: TokenService,) {
   this.token= this.tokenService.get();
    this.month = datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
    this.dateConfig = {
      format: 'YYYY-MM-DD',
      min: this.month,
    };

    this.fromDate = datePipe.transform(
      new Date().setDate(new Date().getDate() - 1),
      'yyyy-MM-dd'
    );
    this.fromTime = datePipe.transform(
      new Date().setHours(9, 0, 0),
      'HH:mm:ss'
    );


    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    this.toTime = datePipe.transform(new Date().setHours(8, 59, 59), 'HH:mm:ss');

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
  }

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.listUser();
      this.Livebets();
    });
  
  }
  listUser() {
    this.fullHirarchySub = this.commonService._allUsersSub$.subscribe((res: any) => {
      // console.log(res)
      if (res) {
        this.usersList = res;
        this.loadingService.setLoading(false);
      }
    });
  }
  trackById(index, item: any) {
    return item.betId;
  }
  Livebets() {
    let data =
    {
      "token": this.token,
      "uid": this.searchUsername.userName,
      "eventId": this.searcheventtId,
      "marketId": this.searchmarkettId,
      "betId": this.searchbetId,
      "from": this.fromDate + ' ' + this.fromTime,
      "to": this.toDate + ' ' + this.toTime,

      
      
    }
    this.betlistService.settledbets(data).subscribe((res:any) => {
    console.log(res)
    this.livebetlist=res.result
    this.totalRow = new TotalRow();
    this.livebetlist.forEach((bet) => {
      this.totalRow.Totalpnl += bet.PL;
    });
    this.livebetlist.sort((a,b) => new Date(b.betTime).getTime() -  new Date(a.betTime).getTime())
    this.livebetlist?.forEach((user: any) => {
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
    })
  }
  selectNoRows(event) {
    console.log(event.target.value)
    this.p = 1;
    this.n = +event.target.value;
  }
  pageChanged(event) {
    this.p = event;
  }
  filterBybetId(term?: string) {
    this.p = 1;
    // this.listBets()
  }

}
