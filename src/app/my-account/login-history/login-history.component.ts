import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ExportService } from 'src/app/services/export-as.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { environment } from 'src/environments/environment';
import { ActivityLog } from '../models/activity-log.model';
import { MyAccountService } from '../my-account.service';
import * as html2pdf from 'html2pdf.js'
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss'],
})
export class LoginHistoryComponent implements OnInit {
  timeFormat = environment.timeFormat;
  logList = Array<ActivityLog>();
  listCount:number;
  p: number = 1;
  n: number = 10;
  Update: any;
    constructor(
    private myAccountService: MyAccountService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private exportService: ExportService,
    private shareService: ShareDataService
  ) {}

  ngOnInit(): void {
   this.getlanguages();
    // this.commonService.apis$.subscribe((res) => {
    //   this.myAccountService
    //     .logActivity()
    //     .subscribe((res: GenericResponse<ActivityLog[]>) => {
    //       if (res.errorCode === 0) {
    //         this.logList = res.result.sort((a, b) => {
    //           return Date.parse(b.loginTime) - Date.parse(a.loginTime);
    //         });
    //       }
    //       this.loadingService.setLoading(false);
    //     });
    // });
  this.getloginhistory();
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
    this.getloginhistory();
  }
  pageChanged(event){
    this.p=event;
    this.getloginhistory();
  }
  getloginhistory(){
    this.loadingService.setLoading(true);
    this.commonService.apis$.subscribe((res) => {
      this.myAccountService
        .logActivity(this.p,this.n)
        .subscribe((res: GenericResponse<ActivityLog[]>) => {
          if (res.errorCode === 0) {
            let Logcount = res.result[0];
            this.listCount = Logcount.count;
            this.logList = res.result.slice(1);
          }
          this.loadingService.setLoading(false);
        });
    });
  }
  udt;
  edata = [];
  exportExcel() {
    this.udt = {
      data: [
        { A: 'Activity Log' }, 
        {
          A: 'Login Date & Time',
          B: 'Login Status',
          C: 'IP Address',
          D: 'ISP',
          E: 'City/State/Country',
        }, 
      ],
      skipHeader: true,
    };
    this.logList.forEach((x) => {
      this.udt.data.push({
        A: x.loginTime,
        B: x.loginStatus,
        C: x.loginIp,
        D: x.ISP,
        E: x.origin
      });
    });
    this.edata.push(this.udt);
    this.exportService.exportJsonToExcel(this.edata.slice(-1), 'Activity Log_'+new Date().toDateString());
  }
  exportCsv() {
    let col = ['loginTime', 'loginStatus', 'loginIp','ISP', 'origin'];
    this.exportService.exportToCsv(this.logList, 'Activity Log_'+new Date().toDateString(), col);
  }
  exportPdf() {
    var element = document.getElementById('table01');
    var opt = {
      margin: 1,
      filename: 'Activity Log_'+new Date().toDateString(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }
}
