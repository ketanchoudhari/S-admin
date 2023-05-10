import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserLog } from 'src/app/my-account/models/user-log';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/services/export-as.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ETransactionType } from 'src/app/shared/types/transactions-type';
import { BankingService } from '../banking.service';
import * as html2pdf from 'html2pdf.js'
import { CommonService } from 'src/app/services/common.service';

@Component({
  templateUrl: './bankinglog.component.html',
  styleUrls: ['./bankinglog.component.scss'],
})
export class bankingLogComponent implements OnInit {
  userId;
  usersLog;
  transactionType = ETransactionType;
  depositUpline: number;
  depositDownline: number;
  withdrawUpline: number;
  withdrawDownline: number;
  totalDepositDownline : any = 0;
  totalDepositUpline : any = 0;
  totalWithdrawUpline : any = 0;
  totalWithdrawDownline : any = 0;
  totalBalance : any = 0;
  p: number = 1;
  n: number = 10;

  constructor(
    private route: ActivatedRoute,
    private service: BankingService,
    private auth: AuthService,
    private exportService: ExportService,
    public commonService: CommonService,
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    // if (!!this.userId) {
    //   this.service
    //     .getlog(this.userId)
    //     .subscribe((res: GenericResponse<IUserLog[]>) => {
    //       if (res.errorCode === 0) {
    //         this.usersLog = res.result.sort((a, b) => {
    //           return Date.parse(b.dateTime) - Date.parse(a.dateTime);
    //         });
    //       }
    //     });
    // } else {
    //   this.service.getlog().subscribe((res: GenericResponse<IUserLog[]>) => {
    //     if (res.errorCode === 0) {
    //       this.usersLog = res.result.sort((a, b) => {
    //         return Date.parse(b.dateTime) - Date.parse(a.dateTime);
    //       });
    //     }
    //   });
    // }

    this.commonService.apis$.subscribe((res) => {
     this.banklog();
    })
  }
banklog(){
  if (!!this.userId) {
    this.service
      .getlog(this.userId,this.p,this.n)
      .subscribe((res: GenericResponse<IUserLog[]>) => {
        if (res.errorCode === 0) {
          this.usersLog = res.result.sort((a, b) => {
            return Date.parse(b.dateTime) - Date.parse(a.dateTime);
          });
          this.usersLog.forEach((x) => {
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
            this.totalBalance += x.balance;
          });
        }
      });
  } else {
    this.service.getlog(0,this.p,this.n).subscribe((res: GenericResponse<IUserLog[]>) => {
      if (res.errorCode === 0) {
        this.usersLog = res.result.sort((a, b) => {
          return Date.parse(b.dateTime) - Date.parse(a.dateTime);
        });
        this.usersLog.forEach((x) => {
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
          this.totalBalance += x.balance;
          if (x.type == this.transactionType.DEPOSIT_UPLINE || x.type == this.transactionType.WITHDRAW_UPLINE) {
            x.from = "Upline";
            x.withUname = "Upline";
          }
        });
      }
    });
  }
}

selectNoRows(numberOfRows: number) {
  this.p = 1;
  this.n = +numberOfRows;
}

arraySettlement(text) {
  return text.description.includes('settlement'); // Check if any "eating" property is equal to food
}

  udt;
  edata = [];
  exportExcel() {
    this.udt = {
      data: [
        { A: 'Banking Log' }, // title
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
    this.usersLog.forEach((x) => {
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
      E: this.totalWithdrawDownline,
      F: this.totalBalance
    });
    this.edata.push(this.udt);
    this.exportService.exportJsonToExcel(this.edata.slice(-1), 'Transactions Log_'+new Date().toDateString());
  }
  exportCsv() {
    let col = ['userId', 'userName', 'withUid','balance', 'withUname', 'type', 'txnType', 'description', 'dateTime','amount','from','to'];
    this.exportService.exportToCsv(this.usersLog, 'Transactions Log_'+new Date().toDateString(), col);
  }
  exportPdf() {
    var element = document.getElementById('table_transfer');
    var opt = {
      margin: 1,
      filename: 'Transactions Log_'+new Date().toDateString(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }
}
