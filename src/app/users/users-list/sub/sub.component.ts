import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  share,
  switchMap,
} from 'rxjs/operators';
import { BankingService } from 'src/app/banking/banking.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserSearchService } from 'src/app/services/user-search.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { Hierarchy } from 'src/app/shared/types/hierarchy';
import { ISharing } from 'src/app/shared/types/sharing';
import { ThemeService } from 'src/app/theme';
import { Theme } from 'src/app/theme/symbols';
import { environment } from 'src/environments/environment';
import { CreateUser } from '../../models/create-user.model';
import { IUserList } from '../../models/user-list';
import { User } from '../../models/user.model';
import { UsersService } from '../../users.service';
import { PasswordStrengthValidator } from './password-strength.validator';
import * as bcrypt from 'bcryptjs';
import { removeSpaces } from 'src/app/directives/whitespace.module';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-sub',
  templateUrl: './sub.component.html',
  styleUrls: ['./sub.component.scss'],
})
export class SubComponent implements OnInit {
  @ViewChild('differentSharing') differentSharing?: ElementRef;
  addMemberModalOpen: boolean = false;
  confirmDeleteModalOpen: boolean = false;
  creditRefModalOpen: boolean = false;
  changeStatusOpen: boolean = false;
  showAddMemberButton: boolean = true;
  isDifferentSharingOpen: boolean = false;
  isprepaidOpen: boolean = false;

  currentUser?: CurrentUser;
  userType?: number = 0;

  selectedUid: number = 0;
  selectedUser?: User;

  statusUser?: User;
  selectedStatus: 0 | 1 | 2;

  userRegForm: FormGroup;
  statusForm: FormGroup;
  userRegDefaultValues = {};

  userOriginList: IUserList;
  userList: IUserList;
  columns = [];

  creditRefForm: FormGroup;
  creditRefUser: User;
  userStatusresult:any;
  p: number = 1;

  memberMap: Map<number, Hierarchy>;

  isShow = false;
  showUp = false;
  showTotalBox: boolean = false;
  isPremiumSite = environment.isPremiumSite;
  isBdlevel = environment.isBdlevel;
  isRental=environment.isRental;
  isSharing=environment.isSharing;
  statusMap = {
    0: 'Active',
    1: (this.isPremiumSite)?'Locked':'Suspend',
    2: (this.isPremiumSite)?'Suspended':'Locked',
  };

  statusList = [
    { id: 'all', name: 'All' },
    { id: 'active', name: 'Active' },
    { id: 'locked', name: (this.isPremiumSite && !this.isSharing)?'Suspended':'Locked' },
    { id: 'suspended', name: (this.isPremiumSite && !this.isSharing)?'Locked':'Suspended' },
  ];

  settlementMap = [
    {id:0,name: 'Sharing'},
    {id:1,name: 'Prepaid'},
    {id:2,name: 'Prepost'},
  ];

  currencyMap = [
    { id: 0, name: 'INR' },
    { id: 1, name: 'USD' },
    { id: 2, name: 'HKD' },
    { id: 3, name: 'PTS' },
    { id: 4, name: 'PBU' },
    { id: 5, name: 'PSD' },
    { id: 6, name: 'PKU' },
    { id: 7, name: 'PTH' },
    { id: 8, name: 'BDT' },
    { id: 9, name: 'BZR' },
    { id: 10, name: 'PKR' },
    { id: 11, name: 'PAI' },
    { id: 12, name: 'AUD' },
    { id: 13, name: 'AED' },
    { id: 14, name: 'EUR' },
    { id: 15, name: 'ZAR' },
    { id: 16, name: 'ARS' },
  ];
  domainMap = environment.domainMap;
  selectedCurrency = this.currencyMap[0];

  member: Hierarchy;
  isClient: boolean = false;
  isWhitelabel: boolean = false;
  isAdmin: boolean = false;
  clientUserType: number;
  showDomainCheckbox: boolean = false;
  showCurrencyDropdown: boolean = false;
  showisPrepaid: boolean = false;

  minMaxSharing: number = 0;
  sharingMap: ISharing;

  showDomainInput: boolean;
  showselectDomainInput: boolean;
  users$: Observable<any>;
  isSearchPage: boolean = false;
  activeTheme: Theme;
  isRollingCommChecked: boolean = false;
  totalRow: any;
  showDeleteButton: boolean;

  showCurrency = environment?.showCurrency;
  fixCurrency = environment?.currency;
  // envCurrency
  deleteUserForm: FormGroup;
  isInTransit: boolean;
  isRegInTransit: boolean;
  usersStatus:any = 'active';
  siteName = environment.siteName;
  Update: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private bankingService: BankingService,
    public commonService: CommonService,
    private userSearch: UserSearchService,
    private themeService: ThemeService,
    private shareService: ShareDataService
  ) { 
    var hostname = window.location.hostname;
    console.log(hostname);
  }

  ngOnInit(): void {
    this.getlanguages();
    // this.commonService.listHierarchy();
    // let vrnlUser = this.commonService.vrnlUserType;
    // console.log(vrnlUser,'vrnl user type');
    this.currentUser = this.authService.currentUser;
    // this.currencyMap=this.currencyMap.filter(c=> (this.currentUser?.currencyCode != "INR")?c.name != "INR":c.name);
    // console.log(this.currentUser);

    // if(environment.cu)
    this.selectedUid = 0;
    this.userType = 0;
    this.initUserRegForm();

    this.addDefaultSharing();
    this.addRollingCommission();
    this.addAgentRollingCommission();
    this.initDeleteUserForm();

    this.userRegDefaultValues = this.userRegForm.value;

    this.statusForm = this.formBuilder.group({
      password: [, Validators.required],
    });

    this.creditRefForm = this.formBuilder.group({
      password: [, Validators.required],
      users: this.formBuilder.array([
        this.formBuilder.group({
          userId: [, Validators.required],
          txnType: [3],
          amount: [, Validators.required],
        }),
      ]),
    });
    this.commonService.apis$.subscribe(res => {
      this.route.paramMap.subscribe( paramMap => {
          this.userType = +paramMap.get('userType');
          this.selectedUid = +paramMap.get('selectedUid');
          // console.log(this.userType,this.selectedUid);
          if (!this.selectedUid) {
            this.selectedUid = this.currentUser.userId;
          }
          if (this.selectedUid === this.currentUser.userId) {
            this.listUsers(this.currentUser.userId, this.userType,this.usersStatus);
            if (this.userType == this.commonService.whitelabelUserType) {
              this.addBetstakesettings();
            }
          } else {
            this.listUsers(this.selectedUid,this.userType,this.usersStatus);
          }
      })
    })
    combineLatest([
      this.route.params,
      this.commonService.hierarchyMap$,
    ]).subscribe(([params]) => {
      // console.log(params)

      this.userType = +params.userType;
      this.selectedUid = +params.selectedUid;

      if (!!this.memberMap) {
        this.member = this.memberMap?.get(this.userType);
        // console.log(this.member);
        // if(this.isBdlevel){
        //   if(this.member?.name.includes("whitelabel")){
        //     this.member.name = 'Mother panel';
        //   }
        //    if(this.member?.name==("admin")){
        //     this.member.name = 'Whitelabel';
        //   }
        //    if(this.member?.name==("senior sub admin")){
        //     this.member.name = 'Admin';
        //   }
        //    if(this.member?.name==("sub admin")){
        //     this.member.name = 'Sub admin';
        //   }
        //   if(this.member?.name.includes("super")){
        //     this.member.name = 'Super Master ';
        //   }  
        //   if(this.member?.name.includes("master")){
        //     this.member.name = 'Master';
        //   }
        // }
      }
      if (!!this.member) {
        this.isClient = this.member.name === 'client' || this.member.name === 'user';
        this.isWhitelabel = this.member.id === 2;
        this.isAdmin = this.member.id === 3;
      }
      if (!this.selectedUid) {
        this.selectedUid = this.currentUser.userId;
      }

      if (this.currentUser?.prepaid) {
        this.isprepaidOpen = true;
      } else {
        this.isprepaidOpen = false;
      }
      
      if (this.isWhitelabel) {
        this.userRegForm?.get('domain').setValidators([Validators.required,removeSpaces]);
      }else if(this.currentUser?.domainAllocation && this.isAdmin) {
        //this.userRegForm?.get('domain').setValidators([Validators.required]);
      }else {
        this.userRegForm?.get('domain').setErrors(null);
        this.userRegForm?.get('domain').clearValidators();
      }

      if (this.isClient) {
        // this.userRegForm?.get('sharePercent').setValidators([])
        if (this.userRegForm?.get('sharePercent')) {
          this.userRegForm?.get('sharePercent').setValue(0);
        }
      }

      if (
        (this.currentUser?.userType == this.commonService.vrnlUserType ||
          (this.currentUser?.userType ==
            this.commonService.whitelabelUserType &&
            this.currentUser.domainAllocation)) &&
        this.userType < this.commonService.adminUserType
      ) {
        this.showDomainCheckbox = true;
      } else {
        this.showDomainCheckbox = false;
      }

      if (this.currentUser?.userType == this.commonService.vrnlUserType) {
        this.showDomainInput = true;
      } else {
        this.showDomainInput = false;
      }
      if (
        // (this.currentUser?.userType == this.commonService.whitelabelUserType &&
        // (this.currentUser?.domainAllocation &&
        //   this.userType <= this.commonService.adminUserType))
          this.currentUser?.domainAllocation &&
            this.userType <= this.commonService.subAdminUserType
      ) {
        this.showselectDomainInput = true;
      } else {
        this.showselectDomainInput = false;
      }
      
      if (
        (this.currentUser.userType == this.commonService.vrnlUserType || (this.currentUser?.domainAllocation &&
          this.userType <= this.commonService.adminUserType))
      ) {
        this.showCurrencyDropdown = true;
      } else {
        this.showCurrencyDropdown = false;
      }

      if (
        this.currentUser.userType == this.commonService.vrnlUserType ||
        this.currentUser?.userType == this.commonService.whitelabelUserType
      ) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }

      if (
        this.userType == this.commonService.whitelabelUserType
      ) {
        this.showisPrepaid = true;
      } else {
        this.showisPrepaid = false;
      }
    });

    this.commonService.hierarchyMap$.subscribe((list) => {
      if (!!list) {
        this.memberMap = list;
        this.member = this.memberMap.get(this.userType);
        // console.log(this.memberMap);
      //   if(this.isBdlevel){
      //   if(this.member?.name.includes("whitelabel")){
      //     this.member.name = 'Mother panel';
      //   }
      //    if(this.member?.name==("admin")){
      //     this.member.name = 'Whitelabel';
      //   }
      //    if(this.member?.name==("senior sub admin")){
      //     this.member.name = 'Admin';
      //   }
      //    if(this.member?.name==("sub admin")){
      //     this.member.name = 'Sub admin';
      //   }
      //   if(this.member?.name.includes("super")){
      //     this.member.name = 'Super Master ';
      //   }  
      //   if(this.member?.name.includes("master")){
      //     this.member.name = 'Master';
      //   }
      // }
        this.clientUserType = this.commonService.clientUserType;

        if (!!this.memberMap) {
          this.member = this.memberMap.get(this.userType);
        }
        if (!!this.member) {
          this.isClient = this.member.name === 'client' || this.member.name === 'user';
          this.isWhitelabel = this.member.id === 2;
          this.isAdmin = this.member.id === 3;
        }

        if (this.isWhitelabel) {
          this.userRegForm?.get('maindomain').setValidators([Validators.required,removeSpaces]);
        }else if(this.currentUser?.domainAllocation && this.isAdmin) {
          //this.userRegForm?.get('domain').setValidators([Validators.required]);
        }else {
          this.userRegForm?.get('domain').setErrors(null);
          this.userRegForm?.get('domain').clearValidators();
        }
        if (this.isClient) {
          // this.userRegForm?.get('sharePercent').setValidators([])
          if (this.userRegForm?.get('sharePercent')) {
            this.userRegForm?.get('sharePercent').setValue(0);
          }
        }
      }
    });

    this.userSearch.searchTerm$.subscribe((term) => {
      if (this.userOriginList) {
        // console.log(term)
        this.p = 1;
        if (term !== '') {
          this.userList.users = this.userOriginList.users.filter((e) => {
            return e.userName.toLowerCase().includes(term.toLowerCase());
          });
        } else {
          this.userList.users = this.userOriginList.users;
        }
      }
    });

    this.usersService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
      this.minMaxSharing =
        100 - Math.max(...(<number[]>Object.values(sharing)));
      if (this.userRegForm && this.userRegForm?.get('sharePercent')) {
        this.userRegForm?.get('sharePercent').setValue(0);
        this.userRegForm
          .get('sharePercent')
          .setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.minMaxSharing),
          ]);
        this.userRegForm.updateValueAndValidity();
      }
    });

    this.activeTheme = this.themeService.getActiveTheme();
    // this.refreshList();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
      }

    })
  }
  Resetlogin(userId) {
    this.usersService
      .resetlogin(userId)
      .subscribe((res: any) => {
        if (res.errorCode == 0) {
          this.toastr.success('Login reset successfullY');
          this.listUsers(this.selectedUid, this.userType,this.usersStatus);
        } else {
          this.toastr.error(res.errorDescription);
        }
      });
  }
  showHide() {
    this.isShow = !this.isShow;
    this.showUp = !this.showUp;
  }

  
  initUserRegForm() {
    this.userRegForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          PasswordStrengthValidator,
        ]),
      ],
      currency: [{ value: "", disabled: false }],
      domain: [{ value: "", disabled: false }],
      maindomain:[''],
      fullName: [''],
      creditRef: [0],
      allowDomainAllocation: [0],
      prepaid: [0],
      showstake: [0],
      captcha: [true],
      lcbd: [0],
      allowRollingCommission: [0],
      parentId: [this.currentUser.userId]
      // sharePercent: [0, [Validators.required, Validators.max(100)]],
    });
  }

  confirmDelete(user) {
    this.selectedUser = user;
    this.confirmDeleteModalOpen = true;
    // });
  }

  delete(userId: number) {
    this.confirmDeleteModalOpen = false;
    //  console.log(userId, 'userid');
    if (this.deleteUserForm.valid) {
      bcrypt
        .compare(
          this.deleteUserForm.value.password,
          localStorage.getItem('password')
        )
        .then((res) => {
          if (res) {
            this.usersService
              .deleteUser(userId)
              .subscribe((res: GenericResponse<any>) => {
                if (res && res.errorCode === 0) {
                  this.toastr.success('Deleted Successfully ');
                  this.refreshList();
                } else {
                  this.toastr.error('Please try again ');
                }
              });
          } else {
            this.toastr.error('Invalid Password');
          }
        });
    } else {
      if (this.deleteUserForm.controls.password.errors.required) {
        this.toastr.error('Password is required');
      }
    }
  }

  initDeleteUserForm() {
    this.deleteUserForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  get regForm() {
    return this.userRegForm;
  }

  get usersArray() {
    return this.creditRefForm?.get('users') as FormArray;
  }

  avoidSpace(event) {
    let k = event ? event.which : (<KeyboardEvent>window.event).key;
    if (k == 32) return false;
  }

  register() {
    if (this.userRegForm.valid) {
      let user = <CreateUser>this.userRegForm.value;
      // console.log(user);
      
      user.userType = this.userType;
      if (this.userRegForm.value.currency !== "") {
        user.currencyCode = this.userRegForm.value.currency.name;
        user.currencyId = this.userRegForm.value.currency.id;
      } else {
        user.currencyCode = this.currentUser.currencyCode;
        let currencydetail = this.currencyMap.find(w => w.name == this.currentUser.currencyCode);
        user.currencyId = currencydetail.id;
      }
      user.stakeSetting = this.stakeformatted();
      user.captcha = this.Allowedcaptcha ? 1 : 0;
      // user.prepaid = this.isprepaidOpen ? 1 : 0;
      user.prepaid = +user.prepaid;
      if (this.userRegForm.value.domain !== "") {
        user.domain = this.userRegForm.value.domain.name;
      }
      if(user.maindomain){
        user.domain = this.userRegForm.value.maindomain.trim();
      }
      if(this.isWhitelabel){
        user.lcbd = this.Allowedlcbd ? 1 : 0;
      }else{
        user.lcbd = this.currentUser.lcbd ? 1 : 0;
      }
      
      // console.log(this.userRegForm.value.domain);
      // console.log(this.userRegForm.value.maindomain);
      

      user.allowDomainAllocation = user.allowDomainAllocation ? 1 : 0
      user.allowRollingCommission = user.allowRollingCommission ? 1 : 0;
      
      if (this.isClient && this.isprepaidOpen) user["fullShareCom"] = (this.isPremiumSite)?1:this.fullsharechkbx ? 1 : 0;
      
      if (!this.isDifferentSharingOpen) {
        this.addDefaultSharing();
        // user.sharePercent = (user.sharePercent?user.sharePercent: 0) + (this.minMaxSharing);

        user.cricketSharing =
          user.sharePercent + this.sharingMap.cricketSharing;
        //console.log(user.cricketSharing,user.sharePercent,this.sharingMap.cricketSharing);
        
        user.cricketFancySharing =
          user.sharePercent + this.sharingMap.cricketFancySharing;

        user.dogRaceSharing =
          user.sharePercent + this.sharingMap.dogRaceSharing;

        user.horseRaceSharing =
          user.sharePercent + this.sharingMap.horseRaceSharing;

        user.indianCasinoSharing =
          user.sharePercent + this.sharingMap.indianCasinoSharing;

        user.intCasinoSharing =
          user.sharePercent + this.sharingMap.intCasinoSharing;

        user.soccerSharing = user.sharePercent + this.sharingMap.soccerSharing;

        user.soccerGoalsSharing =
          user.sharePercent + this.sharingMap.soccerGoalsSharing;

        user.tennisSharing = user.sharePercent + this.sharingMap.tennisSharing;

        delete user.sharePercent;
      } else {
        user.cricketSharing =
          (user.cricketSharing ? user.cricketSharing : 0) +
          this.sharingMap.cricketSharing;

        user.cricketFancySharing =
          (user.cricketFancySharing ? user.cricketFancySharing : 0) +
          this.sharingMap.cricketFancySharing;

        user.dogRaceSharing =
          (user.dogRaceSharing ? user.dogRaceSharing : 0) +
          this.sharingMap.dogRaceSharing;

        user.horseRaceSharing =
          (user.horseRaceSharing ? user.horseRaceSharing : 0) +
          this.sharingMap.horseRaceSharing;

        user.indianCasinoSharing =
          (user.indianCasinoSharing ? user.indianCasinoSharing : 0) +
          this.sharingMap.indianCasinoSharing;

        user.intCasinoSharing =
          (user.intCasinoSharing ? user.intCasinoSharing : 0) +
          this.sharingMap.intCasinoSharing;

        user.soccerSharing =
          (user.soccerSharing ? user.soccerSharing : 0) +
          this.sharingMap.soccerSharing;

        user.soccerGoalsSharing =
          (user.soccerGoalsSharing ? user.soccerGoalsSharing : 0) +
          this.sharingMap.soccerGoalsSharing;

        user.tennisSharing =
          (user.tennisSharing ? user.tennisSharing : 0) +
          this.sharingMap.tennisSharing;
      }
      if (!this.isRegInTransit) {
        this.isRegInTransit = true;
        // console.log(user,'userdata');
        // console.log(this.userRegForm);
        this.usersService
          .registration(user)
          .pipe(finalize(() => (this.isRegInTransit = false)))
          .subscribe((res: GenericResponse<any>) => {
            if (res && res.errorCode === 0) {
              this.addMemberModalOpen = false;
              this.toastr.success('User Created');
              this.listUsers(this.selectedUid, this.userType,this.usersStatus);
              this.commonService.updateBalance();
              this.userRegForm.reset(this.userRegDefaultValues);
            } else {
              this.addMemberModalOpen = false;
              this.toastr.error(res.errorDescription);
            }
          });
      }
    } else {
      console.log(this.userRegForm);
      
      this.toastr.error('Invalid Input');
    }
  }

  refreshList() {
    this.listUsers(this.selectedUid, this.userType,this.usersStatus);
    this.router.navigate([], {
      relativeTo: this.route,
    });
  }

  listUsers(selectedUid: number, userType?,usersStatus?) {
    this.userList = null;
    if (this.userType == this.commonService.whitelabelUserType) {
      this.addBetstakesettings();
    }
    let user = {
      creditRef:0,
      downlineBalance: 0,
      exposure: 0,
      availableBalance: 0,
      playerBalance: 0,
      balanceTotal: 0,
      refPL: 0,
      plnet: 0
    };
    this.route.queryParams.subscribe((params) => {
      if (params.user != 'search') {
        this.isSearchPage = false;
        this.loadingService.setLoading(true);
        if (!this.isInTransit) {
          this.isInTransit = true;
          this.usersService
            .listUser(selectedUid, userType, usersStatus)
            .pipe(finalize(() => (this.isInTransit = false)))
            .subscribe((res: GenericResponse<IUserList[]>) => {
              // console.log(res)
              this.showTotalBox = true;
              if (res.errorCode === 0) {
                res.result[0].users = res.result[0].users.reverse();
                this.userOriginList = res.result[0];
                this.userList = Object.assign({}, this.userOriginList);
                this.userList.users.forEach((user) => {
                  user["refPL"] = user?.creditRef - (user?.availableBalance + user?.exposure + user?.downlineBalance);
                  user["balanceTotal"] = user?.availableBalance + user?.downlineBalance;
                  user.refPL=+(user.refPL).toFixed(2);
                  user.balanceTotal=+(user.balanceTotal).toFixed(2);
                  if(user.refPL !== 0){
                    user.refPL = (user.refPL * -1)
                  }
                })
                this.totalRow = this.userList.users.reduce((acc, c) => {
                  acc.creditRef += c.creditRef;
                  acc.downlineBalance += c.downlineBalance;
                  acc.exposure += c.exposure;
                  acc.availableBalance += c.availableBalance;
                  acc.playerBalance += c.playerBalance;
                  acc.balanceTotal += c.balanceTotal;
                  // acc.refPL += (c.userType == 8) ? (c.refPL * - 1) : c.refPL;
                  acc.refPL += c.refPL;
                  acc.plnet += c.plnet;
                  return acc;
                }, user);
              }
              this.loadingService.setLoading(false);
            });
        }
      } else {
        this.isSearchPage = true;
        this.users$ = this.userSearch.searchTerm$.pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((term: string) => (term)),
          share()
        );

        this.users$.subscribe((res) => {
          // console.log(res);
          this.userList = Object.assign({}, res?.result[0]);
          //  console.log(this.userList, 'response of search user api');
        });
      }
    });
  }

  transferCreditRef() {
    if (this.creditRefForm.valid) {
      this.bankingService
        .transfer(this.creditRefForm.value)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Credit Updated');
            this.listUsers(this.selectedUid, this.userType,this.usersStatus);
            this.creditRefModalOpen = false;
            this.resetCreditForm();
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  pushDataToRoute(data: { userType: number; userName: string }) {
    history.pushState({ data }, '');
  }

  toggleAddMemberModal() {
    this.addMemberModalOpen = true;
    if (!!this.differentSharing) {
      this.differentSharing.nativeElement.checked = false;
    }
    this.showDifferentSharing(false);
  }

  openCreditRefModal(user: User) {
    this.creditRefUser = user;
    this.usersArray.controls.forEach((control) => {
      control.get('userId').setValue(user.userId);
    });
    this.creditRefModalOpen = true;
  }

  resetCreditForm() {
    this.usersArray.controls.forEach((control) => {
      control.get('amount').reset();
    });
    this.creditRefForm.get('password').reset();
  }

  openCreditRefWindow(userId: number, userName: string) {
    let newWindow = window.open(
      `${window.location.origin}${window.location.pathname}/#/x/creditRefLog/${userId}`,
      `_blank`,
      `width=600,height=660,scrollbars=1,name=${this.creditRefUser.userName}`
    );
    newWindow['userName'] = userName;
  }

  openChangeStatusModal(user: User) {
    this.statusUser = user;
    this.changeStatusOpen = true;
  }

  selectStatus(event: Event, status: 0 | 1 | 2) {
    if (this.statusUser.userStatus !== status) {
      (<HTMLButtonElement>event.target).classList.add('open');
      this.selectedStatus = status;
    }
  }

  changeStatus() {
    if (this.statusForm.valid && this.selectedStatus !== null) {
      let changeStatus = this.statusForm.value;
      changeStatus.userStatus = this.selectedStatus;
      this.usersService
        .updateStatus(this.statusUser.userId, changeStatus)
        .subscribe((res: GenericResponse<any>) => {
          console.log(res);
          if (res && res.errorCode === 0) {
            this.changeStatusOpen = false;
            if(this.isPremiumSite){
              this.userStatusresult = res;
              setTimeout(() => {
                this.userStatusresult = undefined;
              }, 3000)
            }else{
              this.toastr.success('Changed status successfully');
            }
            if(environment?.isB2C){
              this.sendEmail(this.selectedStatus);
            }
            this.listUsers(this.selectedUid, this.userType);
            this.selectedStatus = null;
            this.statusForm.reset();
          } else {
            if(this.isPremiumSite){
              this.userStatusresult = res;
              setTimeout(() => {
                this.userStatusresult = undefined;
              }, 3000)
            }else{
              this.toastr.error(res.errorDescription);
            }
          }
        });
    } else {
      //  console.log(this.statusForm);
      if(this.isPremiumSite){
        this.userStatusresult = {errorDescription:"Invalid Input",errorCode : 1};
        setTimeout(() => {
          this.userStatusresult = undefined;
        }, 3000)
      }else{
        this.toastr.error('Invalid Input');
      }
    }
  }
  sendEmail(selectedStatus: any) {
      let data = {
        email : this.statusUser.userName,
        siteName:this.siteName,
        domain:window.origin
      }
      if(selectedStatus==1){
        this.usersService.sendSuspendMail(data).subscribe((res: GenericResponse<any>) => {
          console.log(res);
        });
      }else{
        this.usersService.sendBlockMail(data).subscribe((res: GenericResponse<any>) => {
          console.log(res);
        });
      }
  }

  resetStatusModal() {
    this.selectedStatus = null;
    this.statusForm.reset();
  }

  showBalanceDetail(user) {
    // let el = document.getElementById(`tempBalanceTr_${user}`);
    // console.log(el.style.display);
    // if (el.style.display === 'none') {
    //   el.style.display = 'table-row';
    // } else {
    //   el.style.display = 'none';
    // }
    user.showBalance = !user.showBalance;
  }

  showDifferentSharing(value) {
    //  console.log(value);

    this.isDifferentSharingOpen = value;
    if (value) {
      this.addDifferentSharing();
      this.removeDefaultSharing();
    } else {
      this.addDefaultSharing();
      this.removeDifferentSharing();
    }
  }

  fullsharechkbx: boolean = false;
  fullsharecomm(value: boolean) {
    this.fullsharechkbx = value;
  }

  showSharing(bool: boolean) {
    this.isprepaidOpen = bool;
  }

  showprepaidSharing(value) {
    console.log(value);
    if(value == '1'){
      this.isprepaidOpen = true;
    }
    if(value == '2'){
      this.isprepaidOpen = true;
    }
    if(value == '0'){
      this.isprepaidOpen = false;
    }
    
  }

  Allowedcaptcha: boolean = true;
  checkcaptcha(bool: boolean) {
    this.Allowedcaptcha = bool;
  }

  Allowedlcbd: boolean = false;
  checklcbd(bool: boolean) {
    this.Allowedlcbd = bool;
  }

  showstakesetting: boolean = false;
  showstakevalues(bool: boolean) {
    this.showstakesetting = bool;
  }


  isRollingCommission: boolean = false;
  showRollingCommission(bool) {
    this.isRollingCommission = bool;
    if (bool) {
    } else {
      this.removeRollingCommission();
    }
  }

  isAgentRollingCommission: boolean = false;
  showAgentRollingCommission(bool) {
    this.isAgentRollingCommission = bool;
    if (bool) {
    } else {
      this.removeAgentRollingCommission();
    }
  }

  addBetstakesettings() {
    this.userRegForm.addControl('stake1', this.formBuilder.control("5"));
    this.userRegForm.addControl('stake2', this.formBuilder.control("10"));
    this.userRegForm.addControl('stake3', this.formBuilder.control("50"));
    this.userRegForm.addControl('stake4', this.formBuilder.control("100"));
    this.userRegForm.addControl('stake5', this.formBuilder.control("500"));
    this.userRegForm.addControl('stake6', this.formBuilder.control("1000"));
    this.userRegForm.addControl('stake7', this.formBuilder.control("5000"));
    this.userRegForm.addControl('stake8', this.formBuilder.control("10000"));
    this.userRegForm.addControl('stake9', this.formBuilder.control("50000"));
    this.userRegForm.addControl('stake10', this.formBuilder.control("100000"));
  }

  stakeformatted() {
    if (this.userRegForm.value.stake1) {
      var stakes = [this.userRegForm.value.stake1,
      this.userRegForm.value.stake2,
      this.userRegForm.value.stake3,
      this.userRegForm.value.stake4,
      this.userRegForm.value.stake5,
      this.userRegForm.value.stake6,
      this.userRegForm.value.stake7,
      this.userRegForm.value.stake8,
      this.userRegForm.value.stake9,
      this.userRegForm.value.stake10]
    } else {
      var stakes = [];
    }

    return stakes.toString();
  }

  addDifferentSharing() {
    this.userRegForm.addControl(
      'cricketSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.cricketSharing),
      ])
    );
    this.userRegForm.addControl(
      'cricketFancySharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.cricketFancySharing),
      ])
    );
    this.userRegForm.addControl(
      'soccerSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.soccerSharing),
      ])
    );
    this.userRegForm.addControl(
      'soccerGoalsSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.soccerGoalsSharing),
      ])
    );
    this.userRegForm.addControl(
      'tennisSharing',
      this.formBuilder.control({ value: 0, disabled: true })
    );
    this.userRegForm.addControl(
      'bmCommission',
      this.formBuilder.control({ value: 0, disabled: true })
    );
    // this.regForm.get('bmCommission').setValue(this.sharingMap.bmCommission);
    this.userRegForm.addControl(
      'indianCasinoSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.indianCasinoSharing),
      ])
    );
    this.userRegForm.addControl(
      'horseRaceSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.horseRaceSharing),
      ])
    );
    this.userRegForm.addControl(
      'dogRaceSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.dogRaceSharing),
      ])
    );
    this.userRegForm.updateValueAndValidity();
  }

  addRollingCommission() {
    let rollingComm = this.formBuilder.group({});
    let currentUserRollingComm = this.currentUser?.rollingCommission;
    rollingComm.addControl(
      'fancy',
      this.formBuilder.control(currentUserRollingComm?.fancy, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'casino',
      this.formBuilder.control(currentUserRollingComm?.casino, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'exchange',
      this.formBuilder.control(currentUserRollingComm?.exchange, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'bookMaker',
      this.formBuilder.control(currentUserRollingComm?.bookMaker, [
        Validators.min(0),
        Validators.max(100),
      ])
    );
    this.userRegForm.addControl('rollingCommission', rollingComm);
  }

  toggleAllowRollingComm(isRollingComm: boolean) {
    this.isRollingCommChecked = isRollingComm;
  }
  removeRollingCommission() {
    // this.userRegForm.removeControl('rollingCommission');

    let currentUserRollingComm = this.currentUser?.rollingCommission;
    this.userRegForm.get('rollingCommission').setValue(currentUserRollingComm);
  }

  removeAgentRollingCommission() {
    // this.userRegForm.removeControl('agentRollingCommission');

    let currentUserAgentRollingComm = this.currentUser?.agentRollingCommission;
    this.userRegForm
      .get('agentRollingCommission')
      .setValue(currentUserAgentRollingComm);
  }

  addAgentRollingCommission() {
    let rollingComm = this.formBuilder.group({});
    let currentUserAgentRollingComm = this.currentUser?.agentRollingCommission;
    rollingComm.addControl(
      'fancy',
      this.formBuilder.control(currentUserAgentRollingComm?.fancy, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'casino',
      this.formBuilder.control(currentUserAgentRollingComm?.casino, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'exchange',
      this.formBuilder.control(currentUserAgentRollingComm?.exchange, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'bookMaker',
      this.formBuilder.control(currentUserAgentRollingComm?.bookMaker, [
        Validators.min(0),
        Validators.max(100),
      ])
    );
    this.userRegForm.addControl('agentRollingCommission', rollingComm);
  }

  removeDifferentSharing() {
    this.userRegForm.removeControl('cricketSharing');
    this.userRegForm.removeControl('cricketFancySharing');
    this.userRegForm.removeControl('soccerSharing');
    this.userRegForm.removeControl('soccerGoalsSharing');
    this.userRegForm.removeControl('bmCommission');
    this.userRegForm.removeControl('indianCasinoSharing');
    this.userRegForm.removeControl('horseRaceSharing');
    this.userRegForm.removeControl('dogRaceSharing');
    this.userRegForm.removeControl('tennisSharing');
    this.userRegForm.updateValueAndValidity();
  }

  addDefaultSharing() {
    this.userRegForm.addControl(
      'sharePercent',
      new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(this.minMaxSharing),
      ])
    );
    this.userRegForm.updateValueAndValidity();
  }

  removeDefaultSharing() {
    this.userRegForm.removeControl('sharePercent');
    this.userRegForm.updateValueAndValidity();
  }

  toggleUnmatched(userId, unmatched: number) {
    if (+unmatched) {
      this.usersService
        .allowUnmatchedBet(userId, 0)
        .subscribe((res: any) => {
          if (res.errorCode == 0) {
            this.listUsers(this.selectedUid, this.userType);
            this.toastr.error('Unmatched Bets Disabled');
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.usersService
        .allowUnmatchedBet(userId, 1)
        .subscribe((res: GenericResponse<any>) => {
          if (res.errorCode == 0) {
            this.listUsers(this.selectedUid, this.userType,this.usersStatus);
            this.toastr.success('Unmatched Bets Allowed');
          } else {
            this.listUsers(this.selectedUid, this.userType,this.usersStatus);
          }
        });
    }
  }

  selectUserstatus(event){
    this.usersStatus = event;
    if (this.selectedUid === this.currentUser.userId) {
      this.listUsers(this.currentUser.userId, this.userType,this.usersStatus);
    } else {
      this.listUsers(this.selectedUid,this.userType,this.usersStatus);
    }
    this.p = 1;
  }

  trackBy(index, item: User) {
    return item.userId;
  }
}
