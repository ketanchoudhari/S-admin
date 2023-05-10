import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { CommonService } from 'src/app/services/common.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ShareUserService } from 'src/app/services/share-user.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { User } from 'src/app/users/models/user.model';
import { UsersService } from 'src/app/users/users.service';
import { environment } from 'src/environments/environment';
import { IBettingHistory } from '../types/betting-history';

@Component({
  selector: 'app-betting-history',
  templateUrl: './betting-history.component.html',
  styleUrls: ['./betting-history.component.scss'],
})
export class BettingHistoryComponent implements OnInit {
  selectedTabIndex: number = 0;
  fromDate;
  fromTime;
  toDate;
  toTime;

  dateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  userId: number;

  bettingHistory: IBettingHistory[];
  bettingHistoryHolder: IBettingHistory[];
  p: number = 1;
  n: number = 10;

  selectedUser: User;
  siteName = environment.siteName;
month;
  Update: any;
  constructor(
    private datePipe: DatePipe,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private shareUserService: ShareUserService,
    private commonService: CommonService,
    private shareService: ShareDataService
  ) {
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
      new Date().setHours(9, 0, 0),
      'HH:mm:ss'
    );

    this.toDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.toTime = datePipe.transform(new Date(), 'HH:mm:ss');
    
    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
  }
  ngOnInit(): void {
    this.getlanguages();
    this.userId = +this.route.parent.snapshot.params.selectedUid;
    this.commonService.apis$.subscribe((res) => {
      this.getBetHistory();
    });

    this.shareUserService.user$.subscribe((user) => {
      this.selectedUser = user;
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

  getBetHistory() {
    this.usersService
      .betHistory(
        `${this.fromDate} ${this.fromTime}`,
        `${this.toDate} ${this.toTime}`,
        this.userId
      )
      .subscribe((res: GenericResponse<IBettingHistory[]>) => {
        //  console.log(res);

        res.result.forEach(element => {
          if (element.betType == 'yes' || element.betType == 'no') {
            element.selName = element.marketName;
          }
        });
        this.bettingHistoryHolder = res.result.reverse();
        this.bettingHistory = Object.assign([], res.result);
        this.filterBets();
      });
  }

  getReportDate(value) {
    if (value === 'today') {
      this.fromDate = this.datePipe.transform(
        new Date().setDate(new Date().getDate()),
        'yyyy-MM-dd'
      );
      this.fromTime = this.datePipe.transform(
        new Date().setHours(0, 0, 0),
        'HH:mm:ss'
      );

      this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.toTime = this.datePipe.transform(
          new Date().setHours(23, 59, 0),
          'HH:mm:ss'
        );
      
    } else if (value === 'yesterday') {
      this.fromDate = this.datePipe.transform(
        new Date().setDate(new Date().getDate() - 1),
        'yyyy-MM-dd'
      );
      this.fromTime = this.datePipe.transform(
        new Date().setHours(0, 0, 0),
        'HH:mm:ss'
      );

      this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.toTime = this.datePipe.transform(
          new Date().setHours(23, 59, 0),
          'HH:mm:ss'
        );
    }
  }

  toggleExpand(event, id: any) {
    let state = document.getElementById(id).style.display;
    if (state === 'none') {
      document.getElementById(id).style.display = 'table-row';
      event.target.className = 'expand-open';
    } else {
      document.getElementById(id).style.display = 'none';
      event.target.className = 'expand-close';
    }
  }

  selectTab(tabIndex) {
    this.selectedTabIndex = tabIndex;
    this.p = 1;

    this.filterBets();
  }

  filterBets() {
    if (this.selectedTabIndex === 0) {
      this.bettingHistory = this.bettingHistoryHolder.filter((bet) => {
        return !bet.sportName.toLowerCase().includes('live casino');
      });
    } else if (this.selectedTabIndex === 1) {
      this.bettingHistory = this.bettingHistoryHolder.filter((bet) => {
        return bet.sportName.toLowerCase().includes('live casino');
      });
    }
  }
}
