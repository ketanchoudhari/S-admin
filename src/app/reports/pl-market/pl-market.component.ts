import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { ExportService } from 'src/app/services/export-as.service';
//import { ExportAsService } from 'ngx-export-as';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { environment } from 'src/environments/environment';
import { ReportsService } from '../reports.service';
import { IMarketPL } from '../types/market-pl';
import { EnvService } from 'src/app/env.service';

@Component({
  selector: 'app-pl-market',
  templateUrl: './pl-market.component.html',
  styleUrls: ['./pl-market.component.scss'],
})
export class PlMarketComponent implements OnInit, OnDestroy {
  fromDate;
  fromTime;
  toDate;
  toTime;
  toTimeinput: boolean = false;
  p: number = 1;
  n: number = 10;
  dateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  marketReport: IMarketPL[];
  marketReportHolder: IMarketPL[];
  totalRow = {
    commision: 0,
    downLinePL: 0,
    playerPL: 0,
    stake: 0,
    upLinePL: 0,
  };
  subSink = new Subscription();
  isInTransit: boolean;
  siteName = environment.siteName;
  month;
  Update: any;
  constructor(
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private loadingService: LoadingService,
    private exportService: ExportService,
    private commonService: CommonService,
    private envService: EnvService,
    private shareService: ShareDataService
  ) {
    this.toTimeinput = this.envService.environment.toTimeinput;
    this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
    if(this.siteName === 'betswiz'){
      this.dateConfig = {
        format: 'YYYY-MM-DD'
      };
    }else{
      this.dateConfig = {
        format: 'YYYY-MM-DD',
        min: this.month,
      };
    }

    this.fromDate = datePipe.transform(
      new Date().setDate(new Date().getDate() - 1),
      'yyyy-MM-dd'
    );
      this.fromTime = datePipe.transform(
        new Date().setHours(0, 0, 0),
        'HH:mm:ss'
      );
    

    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd');
    if (this.toTimeinput) {
      this.fromTime = this.datePipe.transform(new Date().setHours(9, 0, 0),'HH:mm:ss');
      this.toTime = this.datePipe.transform(new Date().setHours(8, 59, 59), 'HH:mm:ss')
    } else {
      this.fromTime = this.datePipe.transform(new Date().setHours(0, 0, 0),'HH:mm:ss');
      this.toTime = datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
    }

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
  }
  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.getMarketPL();
    });
    this.getlanguages()
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

  getTotalRow() {
    this.totalRow = {
      commision: 0,
      downLinePL: 0,
      playerPL: 0,
      stake: 0,
      upLinePL: 0,
    };
  }

  getMarketPL() {
    this.p = 1;
    this.getTotalRow();
    this.loadingService.setLoading(true);
    if (!this.isInTransit) {
      let plByMarketSub = this.reportsService
        .plReportByMarket(
          `${this.fromDate} ${this.fromTime}`,
          `${this.toDate} ${this.toTime}`
        )
        .pipe(finalize(() => (this.isInTransit = false)))
        .subscribe((res: GenericResponse<IMarketPL[]>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.getTotalRow();
            this.marketReportHolder = res.result.reverse();
            this.marketReport = Object.assign([], this.marketReportHolder);
            this.marketReport.forEach((row) => {
              this.totalRow.stake += row.stake;
              this.totalRow.playerPL += row.playerPL;
              this.totalRow.downLinePL += row.downLinePL;
              this.totalRow.commision += row.commision;
              this.totalRow.upLinePL += row.upLinePL;
            });
            // this.selectSport('0');
          }
          this.loadingService.setLoading(false);
          //  console.log('Market report', this.marketReport);
        });
      this.subSink.add(plByMarketSub);
    }
  }

  toggleExpand(event, id: any, length: number) {
    for (let i = 0; i <= length; i++) {
      let state = document.getElementById(id + i)?.style.display;
      if (state === 'none') {
        let el = document.getElementById(id + i);
        if (el) {
          document.getElementById(id + i).style.display = 'table-row';
          event.target.className = 'expand-open';
        }
      } else {
        let el = document.getElementById(id + i);
        if (el) {
          document.getElementById(id + i).style.display = 'none';
          event.target.className = 'expand-close';
        }
      }
    }
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
      this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59),'HH:mm:ss');
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
        new Date(),
        'HH:mm:ss'
      );
    }
    this.getMarketPL();
  }

  selectSport(value:any) {
    console.log(value)
    this.p = 1;
    // this.getTotalRow();
    if (value !== '0') {

      if(value!="casino"){
        this.marketReport = this.marketReportHolder.filter((row) => {
          return row.sport.toLowerCase() === value;
        });
      }else{
        this.marketReport = this.marketReportHolder.filter((row) => {
          return row.sport.toLowerCase()!='soccer' && row.sport.toLowerCase()!='tennis' && row.sport.toLowerCase()!='cricket' && row.sport.toLowerCase()!='horse racing' && row.sport.toLowerCase()!='greyhound racing';
        });
      }
      
    }
     else {
      this.marketReport = this.marketReportHolder;
    }
    console.log(this.marketReport)
    this.getTotalRow();
    this.marketReport.forEach((row) => {
      this.totalRow.stake += row.stake;
      this.totalRow.playerPL += row.playerPL;
      this.totalRow.downLinePL += row.downLinePL;
      this.totalRow.commision += row.commision;
      this.totalRow.upLinePL += row.upLinePL;
    });
  }

  udt;
  edata = [];
  exportExcel() {
    this.udt = {
      data: [
        { A: 'User Data' }, // title
        {
          A: 'event',
          // B: 'stake',
          C: 'PlayerPL',
          D: 'DownlinePL',
          E: 'comm.',
          F: 'UplinePL',
        }, // table header
      ],
      skipHeader: true,
    };
    this.marketReport.forEach((x) => {
      this.udt.data.push({
        A: x.eventName,
        // B: x.stake,
        C: x.playerPL,
        D: x.downLinePL,
        E: x.commision,
        F: x.upLinePL,
      });
    });
    this.udt.data.push({
      A: 'Total',
      // B: this.totalRow.stake,
      C: this.totalRow.playerPL,
      D: this.totalRow.downLinePL,
      E: this.totalRow.commision,
      F: this.totalRow.upLinePL,
    });
    this.edata.push(this.udt);
    //  console.log(this.edata, 'edata after changes');

    let name =
      'pl-market' +
      String(this.fromDate).replace('-', '').replace('-', '') +
      ' - ' +
      String(this.toDate).replace('-', '').replace('-', '');
    this.exportService.exportJsonToExcel(this.edata.slice(-1), name);
  }
  exportCsv() {
    let col = [
      'eventName',
      // 'stake',
      'playerPL',
      'downLinePL',
      'commision',
      'upLinePL',
    ];
    let name =
      'pl-market' +
      String(this.fromDate).replace('-', '').replace('-', '') +
      ' - ' +
      String(this.toDate).replace('-', '').replace('-', '');

    this.exportService.exportToCsv(this.marketReport, name, col);
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
    this.loadingService.setLoading(false);
  }
}
