import { Component, OnInit } from '@angular/core';
import { AwcCasinoService } from 'src/app/awcCasino/awc-casino.service';
import { ActivatedRoute } from '@angular/router';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-awccasinobetprofitloss',
  templateUrl: './awccasinobetprofitloss.component.html',
  styleUrls: ['./awccasinobetprofitloss.component.scss']
})
export class AwccasinobetprofitlossComponent implements OnInit {
    fromDate;
    fromTime;
    toDate;
    toTime;
    dateConfig: IDayTimeCalendarConfig;
    timeConfig: ITimeSelectConfig;
    userId: number;
    p: number = 1;
    n: number = 10;
    profitLoss: any;
    profitLossHolder: any;
    totalPL: number = 0;
    Update: any;
    constructor(private awcCasino:AwcCasinoService,
      private authService: AuthService,
      private datePipe: DatePipe,
      private route: ActivatedRoute,
      private loadingService: LoadingService,
      private shareService: ShareDataService,
      public commonService: CommonService,) { 
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
  
    ngOnInit(): void {
      this.getlanguages();
      this.userId = +this.route.parent.snapshot.params.selectedUid;
      this.commonService.apis$.subscribe((res) => {
      this.CasinoprofitLoss()
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
    CasinoprofitLoss(){
      this.awcCasino.casinoAWCProfitLoss( `${this.fromDate} ${this.fromTime}`,
      `${this.toDate} ${this.toTime}`, this.userId).subscribe((res: any) => {
        if (res.errorCode === 0) {
          this.totalPL = 0;
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
        } else {
          this.profitLossHolder = [];
          this.profitLoss = [];
        }
        this.loadingService.setLoading(false);
      });
    
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
  
