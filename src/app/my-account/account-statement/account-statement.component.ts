import { Component, OnInit } from '@angular/core';
import { BankingService } from 'src/app/banking/banking.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ETransactionType } from 'src/app/shared/types/transactions-type';
import { environment } from 'src/environments/environment';
import { IUserLog } from '../models/user-log';
import * as html2pdf from 'html2pdf.js'
import { ExportService } from 'src/app/services/export-as.service';
import { ShareDataService } from 'src/app/services/share-data.service';


@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
})
export class AccountStatementComponent implements OnInit {
  currentUser: CurrentUser;
  userLogs: any;
  listCount:number;
  transactionType = ETransactionType;
  p: number = 1;
  n: number = 10;
  timeFormat = environment.timeFormat;
  depositUpline: number;
  depositDownline: number;
  withdrawUpline: number;
  withdrawDownline: number;
  totalDepositDownline : any = 0;
  totalDepositUpline : any = 0;
  totalWithdrawUpline : any = 0;
  totalWithdrawDownline : any = 0;
  Update: any;

  constructor(
    private bankingService: BankingService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private exportService: ExportService,
    private shareService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    // this.commonService.apis$.subscribe((res) => {
    //   this.bankingService
    //     .getlog(this.currentUser.userId)
    //     .subscribe((res: GenericResponse<IUserLog[]>) => {
    //       if (res.errorCode === 0) {
    //         this.userLogs = res.result.sort((a, b) => {
    //           return Date.parse(b.dateTime) - Date.parse(a.dateTime);
    //         });

    //         // let depositByUpline = this.userLogs.reduce((acc, c: any) => {
    //         //   if (c.type == "depositByUpline" && c.description != "settlement") {
    //         //     return (acc += +c.amount);
    //         //   } else {
    //         //     return acc;
    //         //   }
    //         // }, 0);
    //         // let depositToDownline = this.userLogs.reduce((acc, c: any) => {
    //         //   if (c.type == "depositToDownline" && c.description != "settlement") {
    //         //     return (acc += +c.amount);
    //         //   } else {
    //         //     return acc;
    //         //   }
    //         // }, 0);

    //         // let withdrawlByUpline = this.userLogs.reduce((acc, c: any) => {
    //         //   if (c.type == "withdrawlByUpline" && c.description != "settlement") {
    //         //     return (acc += +c.amount);
    //         //   } else {
    //         //     return acc;
    //         //   }
    //         // }, 0);
    //         // let withdrawlFromDownline = this.userLogs.reduce((acc, c: any) => {
    //         //   if (c.type == "withdrawlFromDownline" && c.description != "settlement") {
    //         //     return (acc += +c.amount);
    //         //   } else {
    //         //     return acc;
    //         //   }
    //         // }, 0);

    //         // console.log(depositByUpline, depositToDownline);
    //         // console.log(withdrawlByUpline, withdrawlFromDownline);

    //       }
    //       this.loadingService.setLoading(false);
    //     });
    // });
    this.getaccount();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }
  getaccount(){
    this.loadingService.setLoading(true);
    this.commonService.apis$.subscribe((res) => {
      this.bankingService
        .getlog(this.currentUser.userId,this.p,this.n)
        .subscribe((res: GenericResponse<IUserLog[]>) => {
          if (res.errorCode === 0) {
            let Logcount = res.result[0];
            this.listCount = Logcount.count;
            this.userLogs = res.result.slice(1);
            this.totalDepositDownline = 0;
            this.totalDepositUpline = 0;
            this.totalWithdrawUpline = 0;
            this.totalWithdrawDownline = 0;
            this.userLogs.forEach((x) => {
              if (!this.arraySettlement(x)) {
              if (x.type == this.transactionType.DEPOSIT_UPLINE) {
                this.totalDepositUpline += x.amount;
              }
              if (x.type == this.transactionType.DEPOSIT_DOWNLINE) {
                this.totalDepositDownline += x.amount;
              }
              if (x.type == this.transactionType.WITHDRAW_UPLINE) {
                this.totalWithdrawUpline += x.amount;
              }
              if (x.type == this.transactionType.WITHDRAW_DOWNLINE) {
                this.totalWithdrawDownline += x.amount;
              }
            }
            if (x.type == this.transactionType.DEPOSIT_UPLINE || x.type == this.transactionType.WITHDRAW_UPLINE) {
              x.from = "Upline";
              x.withUname = "Upline";
            }
            });

            // let depositByUpline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "depositByUpline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);
            // let depositToDownline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "depositToDownline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);

            // let withdrawlByUpline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "withdrawlByUpline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);
            // let withdrawlFromDownline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "withdrawlFromDownline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);

            // console.log(depositByUpline, depositToDownline);
            // console.log(withdrawlByUpline, withdrawlFromDownline);

          }
          this.loadingService.setLoading(false);
        });
    });
  }

  selectNoRows(numberOfRows: number) {
    this.p = 1;
    this.n = +numberOfRows;
    this.getaccount();
  }

  pageChanged(event){
    this.p=event;
    this.getaccount();
  }

  arraySettlement(text) {
    return text.description.includes('settlement'); // Check if any "eating" property is equal to food
  }

  udt;
  edata = [];
  exportExcel() {
    this.udt = {
      data: [
        { A: 'Account Statement' }, // title
        {
          A: 'Date/Time',
          B: 'Deposite By Upline',
          C: 'Deposite By Downline',
          D: 'Withdraw By Upline',
          E: 'Withdraw By Downline',
          F: 'Balance',
          G: 'Remark',
          H: 'From/TO'
        }, // table header
      ],
      skipHeader: true,
    };
    this.userLogs.forEach((x) => {
      if (x.type == this.transactionType.DEPOSIT_UPLINE) {
        this.depositUpline = x.amount;
      }
      else {
        this.depositUpline = 0;
      }
      if (x.type == this.transactionType.DEPOSIT_DOWNLINE) {
        this.depositDownline = x.amount;
      }
      else {
        this.depositDownline = 0;
      }
      if (x.type == this.transactionType.WITHDRAW_UPLINE) {
        this.withdrawUpline = x.amount;
      }
      else {
        this.withdrawUpline = 0;
      }
      if (x.type == this.transactionType.WITHDRAW_DOWNLINE) {
        this.withdrawDownline = x.amount;
      }
      else {
        this.withdrawDownline = 0;
      }
      this.udt.data.push({
        A: x.dateTime,
        B: this.depositUpline,
        C: this.depositDownline,
        D: this.withdrawUpline,
        E: this.withdrawDownline,
        F: x.balance,
        G: x.description,
        H: 'From ' + x.from + ' To ' + x.to
      });
    });
    this.udt.data.push({
      A: 'Total',
      B: this.totalDepositUpline,
      C: this.totalDepositDownline,
      D: this.totalWithdrawUpline,
      E: this.totalWithdrawDownline
    });
    this.edata.push(this.udt);
    this.exportService.exportJsonToExcel(this.edata.slice(-1), 'Activity Statement_'+new Date().toDateString());
  }
  exportCsv() {
    let col = ['userId', 'userName', 'withUid','balance', 'withUname', 'type', 'txnType', 'description', 'dateTime','amount','from','to'];
    let name =
      'Account Statement';
    this.exportService.exportToCsv(this.userLogs, 'Activity Statement_'+new Date().toDateString(), col);
  }
  exportPdf() {
    var element = document.getElementById('table_log');
    var opt = {
      margin: 1,
      filename: 'Activity Statement_'+new Date().toDateString(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }
}
