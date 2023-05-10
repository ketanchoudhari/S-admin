import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { ExportAsService } from 'ngx-export-as';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-reject-bet-history',
  templateUrl: './reject-bet-history.component.html',
  styleUrls: ['./reject-bet-history.component.scss'],
})
export class RejectBetHistoryComponent implements OnInit {
  fromDate;
  fromTime;
  toDate;
  toTime;

  p: number = 1;

  dateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  accountsList: any[];
  constructor(
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private exportAsService: ExportAsService
  ) {
    this.dateConfig = {
      format: 'YYYY-MM-DD',
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

  ngOnInit(): void {}
}
