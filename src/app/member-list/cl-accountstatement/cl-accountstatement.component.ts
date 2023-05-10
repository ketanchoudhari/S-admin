import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { BankingService } from 'src/app/banking/banking.service';
import { IUserLog } from 'src/app/my-account/models/user-log';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ETransactionType } from 'src/app/shared/types/transactions-type';
import { UsersService } from 'src/app/users/users.service';
import { environment } from 'src/environments/environment';
import { ImartketBets } from './marketbet';

@Component({
  selector: 'app-cl-accountstatement',
  templateUrl: './cl-accountstatement.component.html',
  styleUrls: ['./cl-accountstatement.component.scss']
})
export class ClAccountstatementComponent implements OnInit {

  currentUser: CurrentUser;
  userLogs: IUserLog[];
  userId: number;
  openbets: boolean = false;
  marketBets: ImartketBets[] = [];
  transactionType = ETransactionType;
  p: number = 1;
  timeFormat = environment.timeFormat;
  fromDate;
  fromTime;
  toDate;
  toTime;

  dateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  siteName = environment.siteName;
  month;
  Update: any;
  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private usersService: UsersService,
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


    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    this.toTime = datePipe.transform(new Date(), 'HH:mm:ss');

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
  }

  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    this.userId = +this.route.parent.snapshot.params.selectedUid;
    this.loadingService.setLoading(true);
    this.openbets = false;
    this.commonService.apis$.subscribe((res) => {
      this.usersService
        .betreport(
          `${this.fromDate} ${this.fromTime}`,
          `${this.toDate} ${this.toTime}`,
          this.userId
        )
        .subscribe((res: GenericResponse<IUserLog[]>) => {
          if (res.errorCode === 0) {
            this.userLogs = res.result.reverse();

          }
          this.loadingService.setLoading(false);
        });
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

  getReportDate(value) {
    if (value === 'today') {
      this.fromDate = this.datePipe.transform(
        new Date().setDate(new Date().getDate()),
        'yyyy-MM-dd'
      );
      this.fromTime = this.datePipe.transform(
        new Date().setHours(9, 0, 0),
        'HH:mm:ss'
      );


      this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.toTime = this.datePipe.transform(
        new Date().setHours(23, 59, 0),
        'HH:mm:ss'
      );
      this.getStatement();
    } else if (value === 'yesterday') {
      this.fromDate = this.datePipe.transform(
        new Date().setDate(new Date().getDate() - 1),
        'yyyy-MM-dd'
      );
      this.fromTime = this.datePipe.transform(
        new Date().setHours(9, 0, 0),
        'HH:mm:ss'
      );


      this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.toTime = this.datePipe.transform(
        new Date().setHours(23, 59, 0),
        'HH:mm:ss'
      );
      this.getStatement();
    }
  }

  openStatementBets(bets: ImartketBets[]) {
    this.openbets = true;
    this.marketBets = bets;
    console.log(this.marketBets);
  }

  onBackbuttonn() {
    this.openbets = false;
    this.marketBets = [];
  }

  getStatement() {
    this.loadingService.setLoading(true);
    this.openbets = false;
    this.usersService
      .betreport(
        `${this.fromDate} ${this.fromTime}`,
        `${this.toDate} ${this.toTime}`,
        this.userId
      )
      .subscribe((res: GenericResponse<IUserLog[]>) => {
        if (res.errorCode === 0) {
          this.userLogs = res.result.reverse();
        }
        this.loadingService.setLoading(false);
      });
  }
}
