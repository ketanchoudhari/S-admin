import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { ThemeService } from '../theme';
import { Theme } from '../theme/symbols';
import { BankingReqXpgService } from './banking-req-xpg.service';
import { ITransfer } from './types/transfer-req';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';

@Component({
  selector: 'app-banking-req-xpg',
  templateUrl: './banking-req-xpg.component.html',
  styleUrls: ['./banking-req-xpg.component.scss']
})
export class BankingReqXpgComponent implements OnInit {

  fromDate;
  fromTime;
  toDate;
  toTime;
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  toTimeinput: boolean = false;
  passwordForm:FormGroup;
  imgURL:string='';
  passwordOpen: boolean = false;
  ssAddOpen:boolean=false;
  selectedUser:any;
  from:any
  transferDelay = environment.transferdelay;
  confirmationOpen:boolean=false;
  bankDetailsOpen:boolean=false;
  upiDetailsOpen:boolean=false;
  showTotalBox: boolean = false;
  validRow: number = 0;
  isInTransit: boolean;
  usersData:any= [];
  filteredUsersList:any = [];
  currentUser: CurrentUser;
  submitted: boolean = false;
  transFertresult:any;
  searchTerm: string = "";
  transFertErrorresult:string;
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
  selectedBankUPIData:any;
  reportInterval:any;
  transactionType =[
    { id: 0, name: 'All'},
    { id: 1, name: 'Deposit'},
    { id: 2, name: 'Withdraw'},
  ];

  transactionStatus =[
    { id: 5, name: 'All'},
    { id: 0, name: 'Pending'},
    { id: 1, name: 'Approved'},
    { id: 2, name: 'Rejected'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private bankingService: BankingReqXpgService,
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


  setBankUpi(user:any){
    if(user.payment_method=="Bank"){
      this.bankDetailsOpen = true;
      this.upiDetailsOpen = false;
      this.selectedBankUPIData = user.BankDetails[0]
    }else{
      this.bankDetailsOpen = false;
      this.upiDetailsOpen = true;
      this.selectedBankUPIData = user.UpiDetails[0]
    }
  
  }

  saveImage(ss:any){
    this.selectedUser.img = ss;
  }
  
  ngOnInit(): void {
    this.activeTheme = this.themeService.getActiveTheme();
    this.currentUser = this.authService.currentUser;
    this.loadingService.setLoading(true);
    this.passwordForm = this.formBuilder.group({
      password: [, Validators.required],
    });
    this.loadingService.setLoading(true);
    this.getallTrnRequest(false,this.selectedType==''?0:this.selectedType,this.selectedStatus==''?0:this.selectedStatus);
    // this.reportInterval = setInterval(() => {
    //   this.getallTrnRequest(false,this.selectedType==''?0:this.selectedType,this.selectedStatus==''?0:this.selectedStatus);
    // }, 5000)
  }

  ngOnDestroy(): void {
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
    }
  }

  filterByTerm(term?: string) {
    if (term && term != '') {
      this.usersData = this.filteredUsersList.filter((user:any) => {
        return user.reciever.includes(term) || user.ref_no.includes(term);
      });
    }
    else{
      this.usersData = this.filteredUsersList
    }
  }

 
  resetPasswordModal() {
    this.passwordForm.reset();
  }


  selectTransactionType(type:any){
    this.selectedType = type;
  }

  selectTransactionStatus(status:any){
    this.selectTransactionStatus = status;
  }

  trackById(idx, id) {
    return id.trn_id;
  }

  getallTrnRequest(afterTransfer: boolean,type:any,status:any) {
    let from = this.fromDate+' '+this.fromTime;
    let to = this.toDate+' '+this.toTime;
    if (!this.isInTransit) {
      this.isInTransit = true;
    }
    this.bankingService
      .getalltrnrequest(type,status,from,to)
      .pipe(finalize(() => (this.isInTransit = false)))
      .subscribe((res: any) => {
        this.showTotalBox = true;
        if (res.status == 'Success') {
          this.usersData = res.data;
          this.filteredUsersList = res.data;
          this.loadingService.setLoading(false);
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
openChangeStatusModal(user: any) {
  this.selectedUser = user;
  if(this.selectedUser.remark){
    this.passwordOpen = true;
  }else{
    this.toastr.error(`Fill The Remark First...`);
  }
}

openConfirmation(user: any){
  this.selectedUser = user;
  if(this.selectedUser.remark){
    this.confirmationOpen = true;
  }else{
    this.toastr.error(`Fill The Remark First...`);
  }
}

openAddSS(user: any) {
  this.selectedUser = user;
  
  
  this.ssAddOpen = true;
}

  transfer() {
    this.loadingService.setLoading(true);
    this.passwordOpen = false;
    if( this.selectedUser.trn_type == 1){
      this.processDepRequest();
    }
    if( this.selectedUser.trn_type == 2){
      this.processWDRequest();
    }
  }
  processRejectRequest() {
    let data = {
      "uid":this.selectedUser?.uid,
      "trn_id":this.selectedUser?.trn_id,
      "status":"2",
      "trn_type":this.selectedUser?.trn_type,
      "coins":this.selectedUser.coins,
      "remark":this.selectedUser.remark
    }
    this.loadingService.setLoading(true)
    this.bankingService
      .updateTrnrequest(data)
      .subscribe((res:any) => {
        if (res.status === 'Success') {
          this.toastr.success(res.message);
          this.getallTrnRequest(false,'0','0');
          this.confirmationOpen = false;
        } else {
          this.toastr.error(res.message);
        }
        this.loadingService.setLoading(false)
      });
  }
  processDepRequest() {
    let data = {
      "uid":this.selectedUser?.uid,
      "trn_id":this.selectedUser?.trn_id,
      "status":"1",
      "trn_type":this.selectedUser?.trn_type,
      "coins":this.selectedUser.coins,
      "remark":this.selectedUser.remark
    }
    
    this.bankingService
      .updateTrnrequest(data)
      .subscribe((res:any) => {
        if (res.status === 'Success') {
          this.toastr.success(res.message);
          this.getallTrnRequest(false,'0','0');
          this.loadingService.setLoading(false);
        } else {
          this.loadingService.setLoading(false);
          this.toastr.error(res.message);
        }
      });
  }

  processWDRequest() {
    let data = {
      "uid":this.selectedUser?.uid,
      "trn_id":this.selectedUser?.trn_id,
      "status":"1",
      "trn_type":this.selectedUser?.trn_type,
      "coins":this.selectedUser.coins,
      "remark":this.selectedUser.remark
    }
    this.bankingService
      .updateTrnrequest(data)
      .subscribe((res:any) => {
        if (res.status === 'Success') {
          this.toastr.success(res.message);
          this.getallTrnRequest(false,'0','0');
          this.loadingService.setLoading(false);
        } else {
          this.toastr.error(res.message);
          this.loadingService.setLoading(false);
        }
      });
  }

}
