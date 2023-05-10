import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';
import { ShareDataService } from '../services/share-data.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { ThemeService } from '../theme';
import { Theme } from '../theme/symbols';
import { IUserList } from '../users/models/user-list';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { BankingService } from './banking.service';
import { ITransfer } from './types/transfer';

export class TotalRow {
  constructor(
    public balance: number = 0,
    public availableDW: number = 0,
    public downlineBalance: number = 0,
    public exposure: number = 0,
    public creditRef: number = 0,
    public refPL: number = 0,
    public totalCredRefdown: number = 0,
  ) { }
}

@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss'],
})
export class BankingComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser;
  usersData: IUserList;
  transferForm: FormGroup;
  totalRow = new TotalRow();
  validRow: number = 0;
  showTotalBox: boolean = false;
  transFertresult:any
  transFertErrorresult:string
  siteName=environment.siteName;
  balance: number = 0;

  p: number = 1;
  itemsPerPage: number = environment.isPremiumSite ? 30 : 10;

  formsDefaultVal = {};

  submitted: boolean = false;

  showCurrency = environment?.showCurrency;
  showSettlementTab: boolean = true;
  transferDelay = environment.transferdelay;
  isPremiumSite = environment.isPremiumSite;
  isRental = environment.isRental;
  isBdlevel = environment.isBdlevel;

  private _submit$ = new Subject();
  debounceClick;
  searchTerm$ = new Subject<string>();
  activeTheme: Theme;
  isShow = false;
  showUp = false;
  subSink = new Subscription();
  isInTransit: boolean;
  searchTerm: string = "";
  usersdataArray = [];
  Update: any;
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private bankingService: BankingService,
    private toastr: ToastrService,
    public commonService: CommonService,
    private themeService: ThemeService,
    private shareService: ShareDataService
  ) { }

  fixCurrency = environment?.currency;
  ngOnInit(): void {
    this.getlanguages()
    this.activeTheme = this.themeService.getActiveTheme();
    // console.log(this.activeTheme);


    this.currentUser = this.authService.currentUser;
    this.showSettlementTab=(environment.settlemettab) ? false : this.currentUser?.prepaid;
    // this.showSettlementTab=environment.settlemettab;
    // this.showSettlementTab = this.currentUser?.prepaid;
    // console.log(this.showSettlementTab,environment.settlemettab);

    this.inittransferform();
    this.loadingService.setLoading(true);

    setTimeout(() => {
      this.formsDefaultVal = this.transferForm.value;
    });

    this.commonService.balance$.subscribe((balance) => {
      this.balance = balance;
    });

    this.commonService.apis$.subscribe((res) => {
      this.listUser(false);
      // this.filterByTerm(this.searchTerm);
    });
  }

  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }
  filterByTerm(term?: string, manual?: boolean) {
    if (manual) {
      this.p = 1;
    }

    if (term.length > 0) {
      // this.filterBets();
      // console.log(this.s);
      // this.usersData.users = this.usersData?.users?.filter((user) => {
      //   let agents = Object.values(user.userName).reduce((acc, c) => {
      //     acc.push(c.toLowerCase());
      //     return acc;
      //   }, []);
      //   return (
      //     user.userName?.toLowerCase().includes(term.toLowerCase())
      //   );
      // });
      this.usersData.users = this.usersdataArray.filter((user) => {
        return user.userName.toLowerCase().includes(term.toLowerCase());
      });
      this.inittransferform();
      this.totalRow = new TotalRow();
      // console.log(this.usersData.users);
      setTimeout(() => {
        this.usersData.users.forEach((user) => {
          user.selectDW = null;
          this.addRow(user);
          this.totalRow.balance += user.balance;
          this.totalRow.downlineBalance += user.downlineBalance;
          this.totalRow.creditRef += user.creditRef;
          this.totalRow.refPL += (user.userType == 8) ? (user.refPL * - 1) : user.refPL;
          this.totalRow.exposure += user.exposure;
          this.totalRow.availableDW += user.availableBalance;
        });
      }, 100)
      setTimeout(() => {
        this.resetTransferForm();
      }, 1000);
    } else if (term.length < 1) {
      this.listUser(false);
      this.inittransferform();
      setTimeout(() => {
        this.resetTransferForm();
      }, 1000);
      this.loadingService.setLoading(true);
      // this.filterEvents();
      // this.filterBets();
    }
  }

  showHide() {
    this.isShow = !this.isShow;
    this.showUp = !this.showUp;
  }

  inittransferform() {
    this.transferForm = this.formBuilder.group({
      password: [, Validators.required],
      txntype: [null],
      users: this.formBuilder.array([]),
    });
    this.transferForm.valueChanges.subscribe((val: ITransfer) => {
      val.users = val.users.filter(
        (user) => (user.txnType === 1 || user.txnType === 2 || user.txnType === 3) && user.amount
      );
      setTimeout(() => {
        this.validRow = val.users.length;
      });
    });
  }

  selectedTabIndex: number = 0;
  selectTab(num) {
    this.selectedTabIndex = num;
    //  console.log(this.selectedTabIndex);
    this.resetTransferForm();
  }

  get usersArray() {
    return this.transferForm.get('users') as FormArray;
  }

  listUser(afterTransfer: boolean) {
    // console.log(afterTransfer);
    
    if (!this.isInTransit) {
      this.isInTransit = true;
      this.loadingService.setLoading(true);
    }
    let listUsersSub = this.bankingService
      .listUsers()
      .pipe(finalize(() => (this.isInTransit = false)))
      .subscribe((res: GenericResponse<IUserList[]>) => {
        this.showTotalBox = true;
        if (res.errorCode === 0) {
          res.result[0].users.sort((a, b) => a.userType - b.userType);

          res.result[0].users.sort((a, b) => a.userStatus - b.userStatus);

          // res.result[0].users = res.result[0].users.reverse();

          this.usersData = res.result[0];
          // console.log('userdata', this.usersData.users);
          this.totalRow = new TotalRow();
          this.usersData.users.forEach((user) => {
            user.selectDW = null;
            user["refPL"] = user?.creditRef - (user?.availableBalance + user?.exposure + user?.downlineBalance);
            user.refPL=+(user.refPL).toFixed(2);
            if(user.refPL !== 0){
              user.refPL = (user.refPL * -1)
            }
            if (!afterTransfer) {
              this.addRow(user);
            }
            this.totalRow.balance += user.balance;
            this.totalRow.downlineBalance += user.downlineBalance;
            this.totalRow.creditRef += user.creditRef;
            this.totalRow.refPL += (user.userType == 8) ? (user.refPL * - 1) : user.refPL;
            this.totalRow.exposure += user.exposure;
            this.totalRow.availableDW += user.availableBalance;
            this.totalRow.totalCredRefdown += user.creditRef;
          });
          this.usersdataArray = this.usersData.users;
          this.loadingService.setLoading(false);
        }
      });
    this.subSink.add(listUsersSub);
  }

  addRow(user: User) {
    let row = this.formBuilder.group({
      userId: [user.userId],
      txnType: [],
      amount: [],
      remark: [],
      key: [],
      mainUserId: [this.currentUser.userId],
    });
    this.usersArray.push(row);
    // console.log(this.usersArray);
  }

  timeouttransfer() {
    // this.submitted = true;
    var delayTimeMs:number;
    if(this.siteName == 'lc247'){
      delayTimeMs = 6000;
    }else{
      delayTimeMs = 3000;
    }

    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.transfer();
    }, delayTimeMs);
  }

  transfer() {
    // console.log(this.submitted)
    if (this.submitted) {
      return;
    }
    this.submitted = true;
    this._submit$.next();
    if (this.transferForm.valid) {
      let transferValue: ITransfer = this.transferForm.value;
      transferValue.users = transferValue.users.filter((user) => {
        if ((user.txnType === 1 || user.txnType === 2 || user.txnType === 3) && user.amount) {
          return true;
        }
      });
      //  console.log(this.transferForm.value)


      // transferValue.users.map((user) => {
      //   if (user.txnType === 3) {
      //     user.amount = user.creditRef;
      //     delete user['creditRef'];
      //   }
      //   return user;
      // });

      transferValue.users.forEach((user) => {
        if (this.selectedTabIndex == 1) {
          user.key = 1;
          user.remark = `Settlement - ${user.remark}`;
        } else {
          user.key = 0;
          if(user.remark){
            user.remark =
            user.txnType == 1 || user.txnType == 2 ? `Fund Transfer - ${user.remark}` : '';
          }else{
            user.remark =
            user.txnType == 1 || user.txnType == 2 ? `Fund Transfer` : '';
          }
        }
      });
      //  console.log(transferValue)
      if (transferValue.txntype == 3) {
        transferValue.users.forEach((user) => {
          let password = transferValue.password;
          let userId = user.userId;
          // console.log({...user,password});
          if (user.txnType === 3) {
            this.fullWithdraw({ userId, password });
          }
        })
      } else {
        if (transferValue.users.length) {
          this.bankingService
            .transfer(transferValue)
            .subscribe((res: GenericResponse<any>) => {
              if (res && res.errorCode === 0) {
                // this.toastr.success('Transaction Successful');
                this.resetTransferForm();
                this.listUser(false);
                if(!this.isPremiumSite){
                  res.result.forEach((user) => {
                    if (user.result === 'SUCCESS') {
                      if (this.selectedTabIndex == 0) {
                        this.loadingService.setLoading(false);
                        if(transferValue.txntype === 1){
                          this.toastr.success(
                            `User: ${user.userName}; Deposit Successful`
                          );
                        }
                        if(transferValue.txntype === 2){
                          this.toastr.success(
                            `User: ${user.userName}; Withdraw Successful`
                          );
                        }
                      } else {
                        this.toastr.success(
                          `User: ${user.userName}; Settlement Successful`
                        );
                      }
                    } else {
                      this.loadingService.setLoading(false);
                      this.toastr.error(`User: ${user.userName}; ${user.result}`);
                    }
                  });
                }else{
                  this.transFertresult=res.result;
                  setTimeout(() => {
                    this.transFertresult=[];
                  }, 3000)
                }
                
                this.commonService.updateBalance();
                this.validRow = 0;
                this.searchTerm = "";
              } else {
                this.loadingService.setLoading(false);
                if(!this.isPremiumSite){
                  this.toastr.error(res.errorDescription);
                }else{
                  console.log(res.errorDescription);
                  if(res.errorDescription == 'Invalid input'){
                    this.transFertErrorresult='Wrong Password...';
                  }else{
                    this.transFertErrorresult=res.errorDescription;
                  }
                  setTimeout(() => {
                    this.transFertErrorresult=undefined;
                  }, 3000)
                }
              }
              setTimeout(() => {
                this.submitted = false;
              }, 1000)
            });
        } else {
          if(!this.isPremiumSite){
            this.toastr.error('Invalid Input');
          }else{
            this.transFertErrorresult='Wrong Password';
            setTimeout(() => {
              this.transFertErrorresult=undefined;
            }, 3000)
          }
          this.loadingService.setLoading(false);
          this.submitted = false;
          this.resetTransferForm()
        }
      }
    } else {
      //  console.log(this.transferForm);
      this.submitted = false;
      this.loadingService.setLoading(false);
      if(!this.isPremiumSite){
        this.toastr.error('Invalid Input');
      }else{
        this.transFertErrorresult='Invalid Input';
        setTimeout(() => {
          this.transFertErrorresult=undefined;
        }, 3000)
      }
      this.resetTransferForm()
    }
  }

  resetTransferForm() {
    // console.log(this.usersArray);

    this.transferForm.get('password').reset();
    this.usersArray.controls.forEach((control) => {
      control.get('txnType').setValue(null);
      control.get('amount').setValue(null);
      control.get('key').setValue(null);
      control.get('remark').setValue(null);
    });
  }

  cancelAll() {
    this.usersArray.controls.forEach((user) => {
      user.get('txnType').reset();
      user.get('amount').reset();
      user.get('key').reset();
      user.get('remark').reset();
    });
  }

  editCreditRef(user: User) {
    this.usersArray.controls.forEach((userControl) => {
      if (userControl.get('userId').value === user.userId) {
        userControl.get('amount').setValue(null);
        userControl
          .get('creditRef')
          .setValue(user.creditRef ? user.creditRef : null);
        userControl.get('txnType').setValue(3);
      }
    });
    user.editCreditRef = true;
  }

  cancelEditCreditRef(user: User) {
    this.usersArray.controls.forEach((userControl) => {
      if (userControl.get('userId').value === user.userId) {
        userControl.get('creditRef').reset();
        userControl.get('txnType').setValue(0);
      }
    });
    user.editCreditRef = false;
  }

  selectTxType(user: User, type: 1 | 2) {
    setTimeout(() => {
      user.selectDW = type;
      this.transferForm.controls['txntype'].setValue(type);
      // this.usersArray.controls.forEach((userControl) => {
      //   if (userControl.get('userId').value === user.userId) {
      //     userControl.get('creditRef').reset();
      //   }
      // });
    });
    // console.log(this.transferForm.value);
  }

  selectFWtype(user: User, type: any, i: number) {
    setTimeout(() => {
      user.selectDW = type;
      this.transferForm.controls['txntype'].setValue(type);
    });
    (<FormArray>this.transferForm.get('users'))
      .at(i)
      .get('amount')
      .patchValue(user.balance);
    // console.log(this.transferForm.value);
  }

  fullWithdraw(data) {
    this.bankingService.fullWithdrawal(data).subscribe((res: GenericResponse<any>) => {
      if (res && res.errorCode === 0) {
        // this.toastr.success('Transaction Successful');
        this.resetTransferForm();
        this.listUser(false);
        res.result.forEach((user) => {
          if (user.result === 'SUCCESS') {
            if (this.selectedTabIndex == 0) {
              this.loadingService.setLoading(false);
              this.toastr.success(
                `User: ${user.userName}; Transfer Successful`
              );
            } else {
              this.toastr.success(
                `User: ${user.userName}; Settlement Successful`
              );
            }
          } else {
            this.loadingService.setLoading(false);
            this.toastr.error(`User: ${user.userName}; ${user.result}`);
          }
        });
        this.commonService.updateBalance();
        this.validRow = 0;
        this.searchTerm = "";
      } else {
        this.loadingService.setLoading(false);
        this.toastr.error(res.errorDescription);
      }
      this.submitted = false;
    });
  }

  checkValidity(user: User, amount: string) { }

  setFullAmount(user: User, i: number) {
    (<FormArray>this.transferForm.get('users'))
      .at(i)
      .get('amount')
      .patchValue(Math.abs(user.balance).toFixed(2));
  }

  setFullPL(user: User, i: number) {
    (<FormArray>this.transferForm.get('users'))
      .at(i)
      .get('amount')
      .patchValue(Math.abs(user.refPL).toFixed(2));
  }

  absoluteIndex(indexOnPage: number): number {
    return 10 * (this.p - 1) + indexOnPage;
  }

  trackById(idx, id) {
    return id.userId;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
    this.loadingService.setLoading(false);
  }
}
