import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { AuthService } from 'src/app/services/auth.service';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-casinobethistory',
  templateUrl: './casinobethistory.component.html',
  styleUrls: ['./casinobethistory.component.scss']
})
export class CasinobethistoryComponent implements OnInit {
  fromDate;
  fromTime;
  toDate;
  toTime;
  dateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  userId: number;
  p: number = 1;
  n: number = 10;
  month;
  casinobettingHistory: any=[];
  Update: any;
  constructor(private casino: CasinoApiService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private shareService: ShareDataService,
    private loadingService: LoadingService,
    public commonService: CommonService,) { 
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
    this.CasinobetHistory()
    })
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }
  CasinobetHistory(){
    this.casino.casinobetHistory( `${this.fromDate} ${this.fromTime}`,
    `${this.toDate} ${this.toTime}`, this.userId).subscribe((res: any) => {
      this.casinobettingHistory = res.result;
    })
  }
  selectNoRows(numberOfRows: number) {
    this.p = 1;
    this.n = +numberOfRows;
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

}
