import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserLog } from 'src/app/my-account/models/user-log';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ExportService } from 'src/app/services/export-as.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareUserService } from 'src/app/services/share-user.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ETransactionType } from 'src/app/shared/types/transactions-type';
import { User } from 'src/app/users/models/user.model';
import { UsersService } from 'src/app/users/users.service';
import * as html2pdf from 'html2pdf.js'
import { environment } from 'src/environments/environment';
import { ShareDataService } from 'src/app/services/share-data.service';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
  usersLogs;
  transactionType = ETransactionType;
  selectedUid: any;
  currentUser: any;
  p: number = 1;
  selectedUser: User;
  depositUpline: number;
  depositDownline: number;
  withdrawUpline: number;
  withdrawDownline: number;
  totalDepositDownline: any = 0;
  totalDepositUpline: any = 0;
  totalWithdrawUpline: any = 0;
  totalWithdrawDownline: any = 0;
  totalBalance: any = 0;
  userType: any;
  user?: User;
  isPremiumSite = environment.isPremiumSite;
  Update: any;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private shareUserService: ShareUserService,
    public commonService: CommonService,
    private shareService: ShareDataService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.getlanguages();
    this.selectedUid = this.route.parent.snapshot.params.selectedUid;
    this.currentUser = this.authService.currentUser;
    this.shareUserService.user$.subscribe((user) => {
      this.selectedUser = user;
    });
    this.userType = this.currentUser.userType;
    this.shareUserService.user$.subscribe((user) => {
      if (!!user) {
        this.user = user;
      }
    });
    this.getTransactionHistory();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }
  getTransactionHistory() {
    this.loadingService.setLoading(true);
    this.commonService.apis$.subscribe((res) => {
      this.usersService
        .getlog(this.selectedUid)
        .subscribe((res: GenericResponse<IUserLog[]>) => {
          if (res.errorCode === 0) {
            this.usersLogs = res.result.sort((a, b) => {
              return Date.parse(b.dateTime) - Date.parse(a.dateTime);
            });
            this.usersLogs.forEach((x) => {
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
                if (x.type == this.transactionType.DEPOSIT_UPLINE || x.type == this.transactionType.WITHDRAW_UPLINE) {
                  x.from = "Upline";
                  x.withUname = "Upline";
                }
            });
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
        { A: 'Transactions History' }, // title
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
    this.usersLogs.forEach((x) => {
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
    this.exportService.exportJsonToExcel(this.edata.slice(-1), 'Transaction History_' + new Date().toDateString());
  }
  exportCsv() {
    let col = ['userId', 'userName', 'withUid', 'balance', 'withUname', 'type', 'txnType', 'description', 'dateTime', 'amount', 'from', 'to'];
    this.exportService.exportToCsv(this.usersLogs, 'Transaction History_' + new Date().toDateString(), col);
  }
  exportPdf() {
    var element = document.getElementById('table_log');
    var opt = {
      margin: 1,
      filename: 'Transaction History_' + new Date().toDateString(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }
}
