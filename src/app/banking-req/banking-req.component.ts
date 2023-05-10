import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { ThemeService } from '../theme';
import { Theme } from '../theme/symbols';
import { BankingReqService } from './banking-req.service';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';


@Component({
  selector: 'app-banking-req',
  templateUrl: './banking-req.component.html',
  styleUrls: ['./banking-req.component.scss']
})
export class BankingReqComponent implements OnInit {
  fromDate;
  fromTime;
  toDate;
  toTime;
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  toTimeinput: boolean = false;
  passwordForm: FormGroup;
  imgURL: string = '';
  passwordOpen: boolean = false;
  attachSSOpen: boolean = false;
  ssAddOpen: boolean = false;
  selectedUser: any;
  auto: any
  transferDelay = environment.transferdelay;
  confirmationOpen: boolean = false;
  bankDetailsOpen: boolean = false;
  upiDetailsOpen: boolean = false;
  showTotalBox: boolean = false;
  validRow: number = 0;
  isInTransit: boolean = false;
  isInTransitPNL: boolean = false;
  usersData: any = [];
  filteredUsersList: any = [];
  currentUser: CurrentUser;
  submitted: boolean = false;
  submittedRejectPending: boolean = false;
  transFertresult: any;
  searchTerm: string = "";
  transFertErrorresult: string;
  p: number = 1;
  itemsPerPage: number = 10;
  showCurrency = environment?.showCurrency;
  fixCurrency = environment?.currency;
  activeTheme: Theme;
  formsDefaultVal = {};
  balance: number = 0;
  timeFormat = environment.timeFormat;
  selectedType: string = '';
  selectedStatus: string = '';
  selectedBankUPIData: any;
  reportInterval: any;
  pnl: any;
  transactionType = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Deposit' },
    { id: 2, name: 'Withdraw' },
  ];

  transactionStatus = [
    { id: 5, name: 'All' },
    { id: 0, name: 'Pending' },
    { id: 1, name: 'Approved' },
    { id: 2, name: 'Rejected' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private bankingService: BankingReqService,
    private toastr: ToastrService,
    public commonService: CommonService,
    private themeService: ThemeService,
    private authService: AuthService,
    private datePipe: DatePipe,

  ) {

    this.dateConfig = {
      format: 'YYYY-MM-DD',
    };

    this.fromDate = datePipe.transform(
      new Date().setDate(new Date().getDate() - 7),
      'yyyy-MM-dd'
    );
    this.fromTime = datePipe.transform(
      new Date().setHours(12, 0, 0),
      'HH:mm:ss'
    );


    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    this.toTime = datePipe.transform(new Date().setHours(8, 59, 59), 'HH:mm:ss');

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
  }

  ngOnInit(): void {
    this.activeTheme = this.themeService.getActiveTheme();
    this.currentUser = this.authService.currentUser;
    this.loadingService.setLoading(true);
    this.passwordForm = this.formBuilder.group({
      password: [, Validators.required],
    });
    this.loadingService.setLoading(true);
    this.getallTrnRequest(false, this.selectedType == '' ? 0 : this.selectedType, this.selectedStatus == '' ? 0 : this.selectedStatus);
    //this.getPNL();
    // this.reportInterval = setInterval(() => {
    //   this.getallTrnRequest(false,this.selectedType==''?0:this.selectedType,this.selectedStatus==''?0:this.selectedStatus);
    // }, 5000)
  }

  ngOnDestroy(): void {
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
    }
  }


  showSS(img: any) {
    this.imgURL = `https://sc.cricbuzzer.io/${img}`;
    $("#bigSS").fadeIn();
  }

  setBankUpi(user: any) {
    if (user.payment_method == "Bank") {
      this.bankDetailsOpen = true;
      this.upiDetailsOpen = false;
      this.selectedBankUPIData = user.BankDetails[0]
    } else {
      this.bankDetailsOpen = false;
      this.upiDetailsOpen = true;
      this.selectedBankUPIData = user.UpiDetails[0]
    }

  }

  closeSS() {
    this.imgURL = '';
    $("#bigSS").fadeOut();
  }

  saveImage(ss: any) {
    this.selectedUser.img = ss;
  }

  filterByTerm(term?: string) {
    if (term && term != '') {
      this.usersData = this.filteredUsersList.filter((user: any) => {
        return user.reciever.includes(term) || user.ref_no.includes(term);
      });
    }
    else {
      this.usersData = this.filteredUsersList
    }
  }


  resetPasswordModal() {
    this.passwordForm.reset();
  }


  selectTransactionType(type: any) {
    this.selectedType = type;
  }

  selectTransactionStatus(status: any) {
    this.selectTransactionStatus = status;
  }

  trackById(idx, id) {
    return id.trn_id;
  }

  getallTrnRequest(afterTransfer: boolean, type: any, status: any) {
    let from = this.fromDate + ' ' + this.fromTime;
    let to = this.toDate + ' ' + this.toTime;
    if (this.isInTransit) {
      return;
    }
    this.isInTransit = true;
    this.bankingService
      .getalltrnrequest(this.currentUser.userId, type, status, from, to)
      .pipe(finalize(() => (this.isInTransit = false)))
      .subscribe((res: any) => {
        this.showTotalBox = true;
        if (res.status == 'Success') {
          res.data.forEach((trn) => {
            trn["addImg"] = true;
          })
          this.usersData = res.data;
          this.filteredUsersList = res.data;
          this.loadingService.setLoading(false);
        }
      });
  }

  getPNL() {
    if (this.isInTransitPNL) {
      return;
    }
    this.isInTransitPNL = true;
    this.bankingService
      .getPNL(this.currentUser.userId)
      .pipe(finalize(() => (this.isInTransitPNL = false)))
      .subscribe((res: any) => {
        console.log(res);
        if (res.status == 'Success') {
          this.pnl = res.data[0];
        }
      });
  }

  //  timeouttransfer(user:any) {
  //     // this.submitted = true;

  //     this.loadingService.setLoading(true);
  //     setTimeout(() => {
  //       this.transfer(user);
  //     }, 3000);
  //   }
  openChangeStatusModal(user: any, auto:any) {
    this.selectedUser = user;
    this.auto = auto;
    if (this.selectedUser.remark) {
      this.passwordOpen = true;
    } else {
      this.toastr.error(`Fill The Remark First...`);
    }
  }

  openAttachSSModal(user: any) {
    this.selectedUser = user;
    this.attachSSOpen = true;
  }

  openConfirmation(user: any) {
    this.selectedUser = user;
    console.log(this.selectedUser.remark);

    if (this.selectedUser.remark) {
      this.confirmationOpen = true;
    } else {
      this.toastr.error(`Fill The Remark First...`);
    }
  }

  openAddSS(user: any) {
    this.selectedUser = user;


    this.ssAddOpen = true;
  }

  transfer() {
    console.log(this.selectedUser)
    if (this.submitted) {
      console.log(this.submitted);
      
      return;
    }
    if(this.selectedUser?.isAuto!=1){
      if (!this.selectedUser.img && this.selectedUser.img.length < 1 && this.selectedUser?.trn_type != 2) {
        this.toastr.error("Image is required");
        return;
      }
    }
    this.submitted = true;
    if (this.selectedUser.remark != null || this.selectedUser.remark != '') {
      this.loadingService.setLoading(true);
      let data = {
        password: this.passwordForm.value.password,
        txntype: this.selectedUser.trn_type,
        users: ([{
          userId: this.selectedUser.uid,
          txnType: this.selectedUser.trn_type,
          amount: (this.selectedUser.coins > 0 ? this.selectedUser.coins : (this.selectedUser.coins * -1)),
          remark: this.selectedUser.remark,
          mainUserId: this.currentUser.userId,
          key: 0
        }]),
      }
      this.bankingService
        .transfer(data)
        .pipe(finalize(() => (this.submitted = false)))
        .subscribe((res: GenericResponse<any>) => {
          if (res && res.errorCode === 0) {
            // this.toastr.success('Transaction Successful');
            res.result.forEach((user) => {
              if (user.result === 'SUCCESS') {
                if (user.txnType === 1) {
                  this.processDepRequest();
                  this.toastr.success(
                    `User: ${user.userName}; Deposit Successful`
                  );
                  this.passwordOpen = false;
                }
                if (user.txnType === 2) {
                  this.processWDRequest();
                  this.toastr.success(
                    `User: ${user.userName}; Withdraw Successful`
                  );
                  this.passwordOpen = false;
                }
              } else {
                this.loadingService.setLoading(false);
                this.toastr.error(`User: ${user.userName}; ${user.result}`);
              }
            });

            this.commonService.updateBalance();
            this.validRow = 0;
          } else {
            this.loadingService.setLoading(false);
            this.toastr.error(res.errorDescription);
          }
          setTimeout(() => {
            this.submitted = false;
          }, 1000)
        });
    } else {
      console.log('kjhu')

      this.submitted = false;
      this.loadingService.setLoading(false);
      this.toastr.error('Invalid Input');

      // this.transferForm.reset()
    }
  }

  processRejectRequest() {
    if (this.submittedRejectPending) {
      return;
    }
    this.submittedRejectPending = true;
    if (this.selectedUser.remark != null || this.selectedUser.remark != '') {
      this.loadingService.setLoading(true);
      let data = {
        "uid": this.selectedUser?.uid,
        "trn_id": this.selectedUser?.trn_id,
        "status": "2",
        "trn_type": this.selectedUser?.trn_type,
        "coins": this.selectedUser.coins,
        "remark": this.selectedUser.remark
      }
      this.bankingService
        .updateTrnrequest(data)
        .subscribe((res: any) => {
          if (res.status === 'Success') {
            this.toastr.success(res.message);
            this.getallTrnRequest(false, '0', '0');
            this.confirmationOpen = false;
          } else {
            this.toastr.error(res.message);
          }
          this.submittedRejectPending = false;
          this.loadingService.setLoading(false)
        });
    } else {
      this.submittedRejectPending = false;
      this.loadingService.setLoading(false);
      this.toastr.error('Invalid Input');
      // this.transferForm.reset()
    }
  }

  processAutoPayment(){
    let data = {
      "userName": this.selectedUser?.reciever,
      "userId": this.selectedUser?.uid,
      "parentId": this.selectedUser?.parentId,
      "amount": this.selectedUser?.coins,
      "currencyCode": this.currentUser.currencyCode,
      "bank_account_number": this.selectedUser?.BankDetails[0]?.account_number,
      "ifsc_code": this.selectedUser?.BankDetails[0]?.ifsc_code,
      "bank_code": '',
      "bank_name": this.selectedUser?.BankDetails[0]?.bank_name,
      "account_name": this.selectedUser?.BankDetails[0]?.account_holder
    }
    console.log(data);
    this.loadingService.setLoading(true)
    this.bankingService
      .autoPay(data)
      .subscribe((res: any) => {
        if (res.code == 0) {
          this.toastr.success('Transaction Successfull');
          this.getallTrnRequest(false, '0', '0');
          this.confirmationOpen = false;
        } else {
          this.toastr.error('Transaction Failed');
        }
        this.loadingService.setLoading(false)
      });
  }

  processDepRequest() {
    let data = {
      "uid": this.selectedUser?.uid,
      "trn_id": this.selectedUser?.trn_id,
      "status": "1",
      "trn_type": this.selectedUser?.trn_type,
      "coins": this.selectedUser.coins,
      "remark": this.selectedUser.remark
    }

    this.bankingService
      .updateTrnrequest(data)
      .subscribe((res: any) => {
        if (res.status === 'Success') {
          //this.toastr.success(res.message);
          this.getallTrnRequest(false, '0', '0');
          this.getPNL();
          this.loadingService.setLoading(false);
        } else {
          this.loadingService.setLoading(false);
          this.toastr.error(res.message);
        }

      });
  }

  processWDRequest() {
    let data = {
      "uid": this.selectedUser?.uid,
      "trn_id": this.selectedUser?.trn_id,
      "status": "1",
      "trn_type": this.selectedUser?.trn_type,
      "coins": this.selectedUser.coins,
      "remark": this.selectedUser.remark
    }

    this.bankingService
      .updateTrnrequest(data)
      .subscribe((res: any) => {
        if (res.status === 'Success') {
          //this.toastr.success(res.message);
          this.getallTrnRequest(false, '0', '0');
          this.getPNL();
          this.loadingService.setLoading(false);
        } else {
          this.toastr.error(res.message);
          this.loadingService.setLoading(false);
        }
      });
  }

  attachSS() {
    this.attachSSOpen = false;
    this.loadingService.setLoading(true);
    let formData = new FormData();
    formData.append('uid', this.selectedUser?.uid.toString());
    formData.append('trn_id', this.selectedUser?.trn_id.toString());
    formData.append('trn_img', this.selectedUser.img.item(0));
    this.bankingService
      .updateScreenshot(formData)
      .subscribe((res: any) => {
        if (res.status === 'Success') {
          this.getallTrnRequest(false, '0', '0');
          this.loadingService.setLoading(false);
        } else {
          this.toastr.error(res.message);
          this.loadingService.setLoading(false);
        }
      });
  }
}
