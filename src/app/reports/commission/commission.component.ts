import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { IDownlinePL } from '../types/downline-pl';
import { CommonService } from '../../services/common.service';
import { LoadingService } from '../../services/loading.service';
import { ReportsService } from '../reports.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ITurnover } from './turnover';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionComponent implements OnInit {
  fromDate;
  fromTime;
  toDate;
  toTime;

  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;

  downlineList: IDownlinePL[] = [];
  downlineListHolder: IDownlinePL[] = [];

  p: number = 1;
  turnOverList: ITurnover[] = [];
  confirmSettleModalOpen: boolean = false;
  selectedRow: ITurnover;
  confirmRejectModalOpen: boolean=false;
  month;
  constructor(
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private loadingService: LoadingService,
    public common: CommonService,
    private toastr: ToastrService
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

  selectedTabIndex = 0;
  ngOnInit(): void {
    this.getTurnover();
  }

  selectTab(num) {
    this.selectedTabIndex = num;
  //  console.log(this.selectedTabIndex);
  }

  getTurnover() {
    this.loadingService.setLoading(true);
    this.reportsService
      .turnover(
        `${this.fromDate} ${this.fromTime}`,
        `${this.toDate} ${this.toTime}`
      )
      .subscribe((res: GenericResponse<ITurnover[]>) => {
      //  console.log(res);
        if (res && res.errorCode == 0) {
          this.turnOverList = res.result;
        } else {
          this.turnOverList = [];
        }
        this.loadingService.setLoading(false);
      });
  }

  tabSportMap = {
    0: 'fancy',
    1: 'casino',
    2: 'bookmaker',
    3: 'exchange',
  };

  settleArc() {
    let description = `${this.tabSportMap[this.selectedTabIndex]}-${this.fromDate}-${this.fromTime}`
    this.reportsService
      .settleArc(
        this.selectedRow.userId,
        this.tabSportMap[this.selectedTabIndex],
        `${this.fromDate} ${this.fromTime}`,
        `${this.toDate} ${this.toTime}`,
        description
      )
      .subscribe((res: GenericResponse<any>) => {
      //  console.log(res);
        if (res && res.errorCode == 0) {
          this.toastr.success('Settled successfully');
          this.getTurnover();
        } else {
          this.toastr.error('Something went wrong');
        }
        this.confirmSettleModalOpen = false;
      });
  }

  rejectArc() {
    this.reportsService
      .rejectArc(
        this.selectedRow.userId,
        this.tabSportMap[this.selectedTabIndex],
        `${this.fromDate} ${this.fromTime}`,
        `${this.toDate} ${this.toTime}`
      )
      .subscribe((res: GenericResponse<any>) => {
      //  console.log(res);
        if (res && res.errorCode == 0) {
          this.toastr.success('rejected successfully');
          this.getTurnover();
        } else {
          this.toastr.error('Something went wrong');
        }
        this.confirmRejectModalOpen = false;
      });
  }

  confirmRejectArc(row) {
    this.selectedRow = row;
    this.confirmRejectModalOpen = true;
  }



  confirmSettleArc(row) {
    this.selectedRow = row;
    this.confirmSettleModalOpen = true;
  }

  trackByIndex(index, item) {
    return index;
  }
}
