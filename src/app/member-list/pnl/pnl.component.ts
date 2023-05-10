import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ShareUserService } from 'src/app/services/share-user.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { User } from 'src/app/users/models/user.model';
import { UsersService } from 'src/app/users/users.service';
import { environment } from 'src/environments/environment';
import { IProfitLoss } from '../types/profit-loss';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.scss'],
})
export class PnlComponent implements OnInit {
  selectedTabIndex: number = 0;
  fromDate;
  fromTime;
  toDate;
  toTime;

  dateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  userId: number;

  profitLoss: IProfitLoss[];
  profitLossHolder: IProfitLoss[];
  totalPL: number = 0;
  p: number = 1;
  n: number = 10;
  selectedSport: any;
  selectedUser: User;

  sportsMap = {};
  sportsList: { id: string; name: string }[];
  siteName = environment.siteName;
  month;
  Update: any;
  constructor(
    private datePipe: DatePipe,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private shareUserService: ShareUserService,
    private commonService: CommonService,
    private loadingService: LoadingService,
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
      this.getProfitLoss();
    });

    this.shareUserService.user$.subscribe((user) => {
    //  console.log(user);
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

  getProfitLoss() {
    this.loadingService.setLoading(true);
    this.totalPL = 0;
    this.usersService.profitLoss(
        `${this.fromDate} ${this.fromTime}`,
        `${this.toDate} ${this.toTime}`,
        this.userId
      )
      .subscribe((res: GenericResponse<IProfitLoss[]>) => {
      //  console.log(res);
        if (res.errorCode === 0) {
          this.profitLossHolder = Object.assign([], res.result.reverse());
          this.profitLoss = res.result.reverse().map((pnl) => {
            var totalStakes = 0;
            var backTotal = 0;
            var layTotal = 0;
            var comm = 0;
            var mktTotal = 0;

            pnl.bets.forEach((bet) => {
              totalStakes += +bet.stake;
              if (bet.betType === 'back' || bet.betType === 'yes') {
                backTotal += +bet.pl;
              } else if (bet.betType === 'lay' || bet.betType === 'no') {
                layTotal += +bet.pl;
              }
              // comm += +bet.pl > 0 ? +bet.pl * (+pnl.commission / 100) : 0;
              mktTotal += +bet.pl;
            });
            pnl.totalStakes = totalStakes;
            pnl.backTotal = backTotal;
            pnl.layTotal = layTotal;
            pnl.mktTotal = mktTotal;
            // pnl.comm = comm;
            this.totalPL += pnl.netPL;
            return pnl;
          });
          this.selectSport(0);
          this.filterBets();
        } else {
          this.profitLossHolder = [];
          this.profitLoss = [];
        }
        this.loadingService.setLoading(false);
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

  public selectTab(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
    this.p = 1;
    this.sportsMap = {};
    this.selectedSport = 0;
    this.filterBets();
  }

  selectSport(sportId) {
    this.selectedSport = sportId;
    this.filterBets();
  }

  filterBets() {
    if (this.selectedTabIndex === 0) {
      this.profitLoss = this.profitLossHolder?.filter((bet) => {
        return !bet.sportName.toLowerCase().includes('live casino');
      });
    } else if (this.selectedTabIndex === 1) {
      this.profitLoss = this.profitLossHolder?.filter((bet) => {
        return bet.sportName.toLowerCase().includes('live casino');
      });
    }
    if (+this.selectedSport === 0) {
      this.profitLoss = this.profitLoss;
    } else {
      this.profitLoss = this.profitLoss?.filter((bet) => {
        return bet.sportName.toLowerCase().includes(this.selectedSport);
      });
    }

    this.profitLoss?.forEach((pnl) => {
      this.sportsMap[pnl.sportName.toLowerCase()] = {
        id: pnl.sportName.toLowerCase(),
        name: pnl.sportName,
      };
    });
    this.sportsList = Object.values(this.sportsMap);
    this.totalPL = this.profitLoss?.reduce((acc, c) => acc + c.netPL, 0) | 0;
  }
}
