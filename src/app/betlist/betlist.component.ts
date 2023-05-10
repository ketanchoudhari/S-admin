import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EnvService } from '../env.service';
import { EventsService } from '../events/events.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { IEventFilter } from './bet-list-live/bet-list-live.component';
import { BetlistService } from './betlist.service';
import { IBetHistory } from './types/bet-history';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { IUserList } from '../users/models/user-list';
import { ShareDataService } from '../services/share-data.service';
import { SelectItem } from 'primeng/api';

export class TotalRow {
  constructor(
    public Totalpnl: number = 0
  ) { }
}

@Component({
  selector: 'app-betlist',
  templateUrl: './betlist.component.html',
  styleUrls: ['./betlist.component.scss'],
})

export class BetlistComponent implements OnInit, OnDestroy {
  timeFormat = environment.timeFormat;
  fromDate;
  fromTime;
  toDate;
  toTime;

  totalRow = new TotalRow();
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;

  isVoidBetModalOpen: boolean = false;
  isCancelBetModalOpen: boolean = false;
  isVoidAllBetModalOpen: boolean = false;
  isCancelAllBetModalOpen: boolean = false;

  selectedBet: IBetHistory = null;
  selectedVoidCancelBet = [];
  betIds = [];
  siteName = environment.siteName;
  sportFilterList = [
    { id: 1, fillname: 'soccer', name: 'Soccer' },
    { id: 2, fillname: 'tennis', name: 'Tennis' },
    { id: 4, fillname: 'cricket', name: 'Cricket' },
    // { id: 41, name: 'Cricket Exchange' },
    // { id: -2,fillname:'fancy', name: 'Cricket Fancy' },
    // { id: -1012,fillname:'virtual', name: 'Virtual Cricket' },
    { id: 'teenpatti', fillname: 'teenpatti', name: 'Live Casino' },
    { id: 'x', fillname: 'premium', name: 'Premium' },
    // { id: 74, name: 'Races' },
    { id: 7, fillname: 'horseracing', name: 'Horse Racing' },
    { id: 4339, fillname: 'greyhound', name: 'Greyhound Racing' },
    { id: 'x', fillname: 'x-games', name: 'X-Games' },
    { id: 42, fillname: 'kabaddi', name: 'Kabaddi' },
    { id: 43, fillname: 'election', name: 'Election' },
    { id: 43, fillname: 'Basketball', name: 'Basketball' },
    { id: 43, fillname: 'Volleyball', name: 'Volleyball' },
    { id: 43, fillname: 'Snooker', name: 'Snooker' },
    { id: 43, fillname: 'Motor Sport', name: 'Motor Sport' },
    { id: 43, fillname: 'Ice Hockey', name: 'Ice Hockey' },
    { id: 43, fillname: 'Golf', name: 'Golf' },
    { id: 43, fillname: 'Esports', name: 'Esports' },
    { id: 43, fillname: 'Darts', name: 'Darts' },
    { id: 43, fillname: 'Cycling', name: 'Cycling' },
    { id: 43, fillname: 'Boxing', name: 'Boxing' },
    { id: 43, fillname: 'American Football', name: 'American Football' },
    { id: 43, fillname: 'Gaelic Games', name: 'Gaelic Games' },
    { id: 43, fillname: 'Handball', name: 'Handball' },
    { id: 43, fillname: 'Rugby League', name: 'Rugby League' },
    { id: 43, fillname: 'Rugby Union', name: 'Rugby Union' },
    { id: 43, fillname: 'Australian Rules', name: 'Australian Rules' },
    { id: 43, fillname: 'Politics', name: 'Politics' },
    { id: 43, fillname: 'Kabaddi', name: 'Kabaddi' },
    { id: 43, fillname: 'Winter Sports', name: 'Winter Sports' },
    { id: 43, fillname: 'Mixed Martial Arts', name: 'Mixed Martial Arts' },
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
  ];

  selectedCurrency: string = '';
  selectedSport: string = '';
  selectedEvent: string = '0';
  usersList :SelectItem[]=[];
  public searchInput: String = '';
  public searchResult: Array<any> = [];
  public toggle: Boolean = false;
  searchUsername: any = "";
  searchbetId: string = '';
  selectedEventID: string = '';
  selectedMarket = '0';
  selectedConsolidate = '0';
  selectRowsize = "10";
  selectPagelimit = "10";
  selectSortBy = "1";
  eventsMap = {};
  activeEvents: IEventFilter[];
  activeEventsHolder: IEventFilter[];
  Eventlist = [];
  filteredmarkets = [];
  selectedEventbyMarket = '';
  Volumecheck: any = "0";
  p: number = 1;
  n: number = 10;
  statusList = [
    { id: 4, name: 'All' },
    { id: 1, name: 'Settled' },
    { id: 2, name: 'Cancelled' },
    { id: 3, name: 'Voided' },
  ];

  selectedStatus: { id: number; name: string } = this.statusList[1];

  betList: IBetHistory[];
  betListHolder: IBetHistory[];
  currentUser: CurrentUser;
  showActions: boolean = true;
  showActionscancel: boolean = true
  showActionscancelmain:boolean=false
  searchTerm: string;
  betlistCount: number = 0;
  prevousCount: number;
  filtered;
  marketList;
  heirarchyMap = {
    2: 'WL ID',
    3: 'AD ID',
    4: 'SA ID',
    5: 'SM ID',
    6: 'MA ID',
    7: 'AG ID',
  };

  betListSub: Subscription;
  voidForm: FormGroup;
  cancelForm: FormGroup;
  isInTransit: any;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  userid: any = 0;
  usersList1 = [];
  userdata: any;
  lastuser: any;
  fullHirarchySub: Subscription;
  month;
  isBdlevel=environment.isBdlevel;
  Update: any;
  constructor(
    private datePipe: DatePipe,
    private loadingService: LoadingService,
    private betlistService: BetlistService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private envService: EnvService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private SharedateService: ShareDataService,
  ) {
    this.lastuser = localStorage.getItem('lastuser')
    this.month = datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
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


    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    this.toTime = datePipe.transform(new Date().setHours(8, 59, 59), 'HH:mm:ss');

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
    if(this.isBdlevel){
      this.heirarchyMap = {
        2: 'MP ID',
        3: 'WL ID',
        4: 'AD ID',
        5: 'SA ID',
        6: 'SM ID',
        7: 'MA ID',
      };
    }
  }

  ngOnInit(): void {
    this.getlanguages();
    this.commonService.apis$.subscribe((res) => {
      this.listUser();
      this.listBets();
      this.listevent();
    });

    this.currentUser = this.authService.currentUser;
    this.commonService.hierarchyMap$.subscribe((res) => {
      if (
        this.currentUser.userType !== this.commonService.vrnlUserType &&
        this.currentUser.userType !== this.commonService.whitelabelUserType &&
        this.currentUser.userType  == this.commonService.adminUserType
      ) {
        this.statusList = [
          { id: 4, name: 'All' },
          { id: 1, name: 'Settled' },
          { id: 3, name: 'Voided' },
        ];
        this.selectedStatus = this.statusList[1];
      }
    });
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    let showActions = this.envService.environment.showVoidCancel;
    this.commonService.hierarchyMap$.subscribe((map) => {
      // this.hierarchyMap = map;
      // console.log(this.commonService?.agentUserType, this.currentUser?.userType, this.commonService?.agentUserType - this.currentUser?.userType);

      if (
        this.currentUser.userType === this.commonService.whitelabelUserType ||
        this.currentUser.userType === this.commonService.vrnlUserType ||
        (this.currentUser?.userType == this.commonService.adminUserType &&
          showActions && this.siteName !== 'lc247')
      ) {
        this.showActions = true;
      } else {
        this.showActions = false;
      }
      if (
        (this.currentUser?.userType == this.commonService.adminUserType &&
          showActions) ) {
        this.statusList = [
          { id: 4, name: 'All' },
          { id: 1, name: 'Settled' },
          { id: 3, name: 'Voided' },
        ];
        this.showActionscancel = false;
      } else {
        this.showActionscancel = true;
      }
      if (
        (this.currentUser?.userType == this.commonService.vrnlUserType) ) {
        this.showActionscancelmain = true;
      } else {
        this.showActionscancelmain = false;
      }
      //  console.log(this.currentUser.userType, this.showActions);
    });

    this.voidForm = this.formBuilder.group({
      password: ['', Validators.required],
    });

    this.cancelForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }
  getlanguages() {
    this.SharedateService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
      }

    })
  }
  selectNoRows(event) {
    console.log(event.target.value)
    this.p = 1;
    this.n = +event.target.value;
    this.listBets();
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  listBets() {
    // this.p=1;
    // console.log(this.n, this.betlistCount, this.betlistCount != this.n);
    // if(this.betlistCount!=this.n){
    //   this.selectRowsize = "10";
    //   this.n = +this.selectRowsize;
    // }

    this.loadingService.setLoading(true);
    this.listevent();
    if (!this.isInTransit) {
      console.log(this.searchUsername,"username.....");
      
      this.isInTransit = true;
      this.betListSub = this.betlistService
        .listBets(
          `${this.fromDate} ${this.fromTime}`,
          `${this.toDate} ${this.toTime}`,
          this.selectedStatus.id,
          this.p,
          this.n,
          this.searchUsername,
          this.searchbetId,
          this.selectedEventbyMarket,
          this.selectedEventID,
          this.selectedSport,
          +this.Volumecheck,
          this.selectedCurrency,
          this.selectSortBy
        )
        .pipe(
          finalize(() => {
            this.isInTransit = false;
          })
        )
        .subscribe((res: GenericResponse<IBetHistory[]>) => {
          let listCount: any = res.result[0];
          this.betlistCount = listCount.count;
          // if(this.betlistCount!=this.n){
          //   this.selectRowsize = "10";
          // }
          this.betList = res.result.slice(1);
          this.loadingService.setLoading(false);
          if (res.errorCode === 0) {
            this.betListHolder = res.result.slice(1);
            if (
              this.currentUser.userType !== this.commonService.vrnlUserType &&
              this.currentUser.userType !== this.commonService.whitelabelUserType &&
              this.currentUser.userType !== this.commonService.adminUserType &&
              this.currentUser.userType !== this.commonService.masterUserType
            ) {
              // this.betListHolder = this.betListHolder.filter(
              //   (bet) => bet.status !== 2
              // );
            }
            if (this.betlistCount != this.prevousCount) {
              this.selectPagelimit = "10";
            }
            //console.log(this.prevousCount,this.betlistCount,this.betlistCount!=this.prevousCount);
            this.prevousCount = this.betlistCount;
            this.betList = Object.assign(
              [],
              this.datewisedescending(res.result.slice(1))
            );

            res.result.slice(1).forEach((bet) => {
              bet.activeStatus = false;
              this.uncheckAll();
              this.selectedVoidCancelBet = [];
              let event: IEventFilter = {
                eventId: bet.eventId,
                eventName: bet.eventName,
                sportIds: {
                  ...(this.eventsMap[bet.eventId]
                    ? this.eventsMap[bet.eventId].sportIds
                    : {}),
                  [bet.sportId]: true,
                },
                sportName: bet.sportName,
              };
              this.eventsMap[event.eventId] = event;
            });
            this.totalRow = new TotalRow();
            res.result.slice(1).forEach((bet) => {
              this.totalRow.Totalpnl += bet.PL;
            });
            this.activeEventsHolder = Object.values(this.eventsMap);
            this.activeEvents = Object.assign([], this.activeEventsHolder);
            this.betList = this.betListHolder;
            this.betList?.forEach((user: any) => {
              if (user?.status == 0) {
                user.status = 'Open';
                console.log(user.name)
              }
              if (user?.status == 1) {
                user.status = 'Settled';
              }
              if (user?.status == 2) {
                user.status = 'Cancelled';
              }
              if (user?.status == 3) {
                user.status = 'Voided';
              }
            })
            // this.selectSport(this.selectedSport);
            // this.selectEvent(this.selectedEvent);
            // this.filterEvents();
            // this.filterBets();
            // this.filterByTerm(this.searchTerm);
          }
        });
    }
  }

  datewisedescending(data) {
    data.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      //Ascending Order
      // return <any>new Date(a.betTime)-<any>new Date(b.betTime);
      //Descending Order
      return <any>new Date(b.betTime) - <any>new Date(a.betTime);
    });
  }

  getReportDate(value) {
    if (value === 'today') {
      this.fromDate = this.datePipe.transform(
        new Date().setDate(new Date().getDate()),
        'yyyy-MM-dd'
      );
      this.fromTime = this.datePipe.transform(
        new Date().setHours(9, 0, 0),
        'HH:mm:ss'
      );


      this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.toTime = this.datePipe.transform(new Date().setHours(8, 59, 59), 'HH:mm:ss');
    } else if (value === 'yesterday') {
      this.fromDate = this.datePipe.transform(
        new Date().setDate(new Date().getDate() - 1),
        'yyyy-MM-dd'
      );
      this.fromTime = this.datePipe.transform(
        new Date().setHours(9, 0, 0),
        'HH:mm:ss'
      );


      this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.toTime = this.datePipe.transform(new Date().setHours(8, 59, 59), 'HH:mm:ss');
    }
    this.listBets();
  }

  confirmCancelVoidBet(bet: IBetHistory, type: number) {
    this.selectedBet = bet;
    if (type === 1) {
      this.isVoidBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelBetModalOpen = true;
    }
  }

  confirmCancelVoidAllBet(type: number) {
    if (type === 1) {
      this.isVoidAllBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelAllBetModalOpen = true;
    }
  }

  cancelVoidBet(type: number) {
    //  console.log(this.voidForm.value.password, localStorage.getItem('password'));
    bcrypt
      .compare(this.voidForm.value.password, localStorage.getItem('password'))
      .then((res) => {
        //  console.log(res, 'result');
        if (res) {
          this.betlistService
            .cancelVoidBets(bet, type)
            .subscribe((res: GenericResponse<any>) => {
              if (res.errorCode === 0) {
                this.toastrService.success(
                  `Bet ${type == 2 ? 'Cancelled' : 'Voided'}`
                );
              } else {
                this.toastrService.error('Failed to Cancel/Void Bet');
              }
            });
        } else {
          this.toastrService.error('Invalid Password');
        }
      });

    let bet = {
      betId: this.selectedBet.consolidateId,
    };

    this.closeCancelVoidModal();
  }

  cancelVoidBet1(type: number) {
    // console.log(this.voidForm.value.password, localStorage.getItem('password'));
    let comparePassword = bcrypt
      .compare(this.cancelForm.value.password, localStorage.getItem('password'))
      .then((res) => {
        //  console.log(res, 'result');
        if (res) {
          this.betlistService
            .cancelVoidBets(bet, type)
            .subscribe((res: GenericResponse<any>) => {
              if (res.errorCode === 0) {
                this.toastrService.success(
                  `Bet ${type == 2 ? 'Cancelled' : 'Voided'}`
                );
              } else {
                this.toastrService.error('Failed to Cancel/Void Bet');
              }
            });
        } else {
          this.toastrService.error('Invalid Password');
        }
      });

    let bet = {
      betId: this.selectedBet.consolidateId,
    };

    this.closeCancelVoidModal();
  }

  closeCancelVoidModal() {
    this.isCancelBetModalOpen = false;
    this.isVoidBetModalOpen = false;
    this.selectedBet = null;
  }

  closeCancelVoidAllModal() {
    this.isCancelAllBetModalOpen = false;
    this.isVoidAllBetModalOpen = false;
    this.selectedVoidCancelBet = [];
    this.betList.forEach((event) => (event.activeStatus = false));
    this.uncheckAll();
  }
  closeBoth() {
    this.isCancelBetModalOpen = false;
    this.isVoidBetModalOpen = false;
  }
  selectSport(sportId) {
    this.selectedSport = sportId;
    this.selectedEvent = '0';
    this.selectedMarket = '0';
    this.selectedConsolidate = '0';
    this.filtered = [];
    // this.p = 1;
    this.filterEvents();
    this.filterBets();
    this.filterByTerm(this.searchTerm);
  }

  selectEvent(eventId) {
    this.selectedEvent = eventId;
    this.selectedMarket = '0';
    this.selectedConsolidate = '0';
    this.filtered = [];
    this.filterBets();
    this.filterByTerm(this.searchTerm);
    //this.filterMarketByEvent(eventId);
  }
  selectCurrency(currency) {
    this.selectedCurrency = currency;
  }

  filterBets() {
    // if (+this.selectedSport == 0) {
    //   this.betList = this.betListHolder;
    // } else if (+this.selectedSport === 41) {
    //   this.betList = this.betListHolder?.filter((bet) => {
    //     return bet.sportName.toLowerCase().includes('cricket');
    //   });
    // } else if (this.selectedSport === 'teenpatti') {
    //   this.betList = this.betListHolder?.filter((bet) => {
    //     return bet.sportName.toLowerCase().includes('live casino');
    //   });
    // } else if (+this.selectedSport === 74) {
    //   this.betList = this.betListHolder.filter((event) => {
    //     return +event.sportId == 7 || +event.sportId == 4339;
    //   });
    // } else if (+this.selectedSport === -1012) {
    //   this.betList = this.betListHolder.filter((event) => {
    //     return +event.sportId == -101 || +event.sportId == -102;
    //   });
    // } else if (this.selectedSport === 'x') {
    //   this.betList = this.betListHolder?.filter((bet) => {
    //     return bet.sportName.toLowerCase().includes('exchange games');
    //   });
    // } else {
    //   this.betList = this.betListHolder?.filter(
    //     (bet) => +bet.sportId === +this.selectedSport
    //   );
    //   this.activeEvents = this.activeEventsHolder.filter(
    //     (bet) => +bet.sportIds[+this.selectedSport]
    //   );
    // }

    // if (+this.selectedEvent === 0) {
    //   this.betList = this.betList;
    // } else {
    //   this.betList = this.betListHolder.filter(
    //     (bet) => bet.eventId === this.selectedEvent
    //   );
    // }
    if (this.betList?.length < this.n) {
      // this.p = 1;
    }
  }

  filterEvents() {
    if (this.selectedSport === '0' || this.selectedSport === '') {
      this.activeEvents = this.activeEventsHolder;
    } else if (+this.selectedSport === 41) {
      this.activeEvents = this.activeEventsHolder?.filter((event) => {
        return event.sportName.toLowerCase().includes('cricket');
      });
    } else if (+this.selectedSport === 74) {
      this.activeEvents = this.activeEventsHolder?.filter((event) => {
        return event.sportIds[7] || event.sportIds[4339];
      });
    } else if (+this.selectedSport === -1012) {
      this.activeEvents = this.activeEventsHolder?.filter((event) => {
        return event.sportIds[-101] || event.sportIds[-102];
      });
    } else if (this.selectedSport == 'x') {
      this.activeEvents = this.activeEventsHolder?.filter((event) => {
        return +event.sportName.toLowerCase().includes('exchange games');
      });
    } else if (this.selectedSport === 'teenpatti') {
      this.activeEvents = this.activeEventsHolder?.filter((event) => {
        return event.sportName.toLowerCase().includes('live casino');
      });
    }
  }

  filterByUsername(term?: string) {
    // console.log(term);
    this.p = 1;
    // this.listBets()
  }

  filterBybetId(term?: string) {
    this.p = 1;
    // this.listBets()
  }

  filterbySport(sportId) {
    this.selectedSport = sportId;
    // console.log(this.selectedSport)
    this.p = 1;
    // this.listBets();
    // this.filterEvents();
    // this.filterBets();
    // this.filterByTerm(this.searchTerm);
  }

  listUser() {
    this.fullHirarchySub = this.commonService._allUsersSub$.subscribe((res: any) => {
      // console.log(res)
      if (res) {
        this.usersList = res;
        this.loadingService.setLoading(false);
      }
    });
  }
  fetchSeries(value: String){
    if(value === '') {
      return this.searchResult = []
    }
    this.searchResult = this.usersList?.filter(function(series:any) {
      return series.userName.toLowerCase().includes(value.toLowerCase());
    })
    this.toggle = false;
  }

showDetails(series) {
       this.toggle = true;
       this.searchInput = series.userName;
}

  confirmDelete(selectedBet) {
    if (this.selectedVoidCancelBet.indexOf(selectedBet) > -1) {
      this.selectedVoidCancelBet.splice(this.selectedVoidCancelBet.indexOf(selectedBet), 1);
      selectedBet.activeStatus = false;
    }
  }

  toggleSelectAll(checked: boolean) {
    if (checked) {
      if (this.betList.length >= this.n - 1) {
        for (var i = 0; i < this.n; i++) {
          this.betList[i].activeStatus = true;
        }
      }
      else {
        this.betList.forEach((bet) => (bet.activeStatus = true));
      }
      this.selectedVoidCancelBet = this.betList.filter((bet) => {
        return bet.activeStatus == true;
      });
    } else {
      this.betList.forEach((bet) => (bet.activeStatus = false));
      this.selectedVoidCancelBet = [];
    }
  }
  toggleSelect(checked: boolean, bet: any) {
    bet.activeStatus = checked;
    if (checked) {
      this.selectedVoidCancelBet?.push(bet);
    }
    else {
      if (this.selectedVoidCancelBet.indexOf(bet) > -1) {
        this.selectedVoidCancelBet.splice(this.selectedVoidCancelBet.indexOf(bet), 1);
      }
    }
  }
  voidAll(type) {
    this.loadingService.setLoading(true);
    this.betIds = [];
    this.betList.forEach((event, index) => {
      if (event.activeStatus) {
        this.betIds.push(event.consolidateId);
      }
    });
    let bet = {
      betids: this.betIds,
    };
    bcrypt
      .compare(this.voidForm.value.password, localStorage.getItem('password'))
      .then((res) => {
        this.loadingService.setLoading(false);
        if (res) {
          this.betlistService.voidBets(bet, type)
            .subscribe((res: GenericResponse<any>) => {
              if (res.errorCode === 0) {
                this.toastrService.success(
                  `Bet ${type == 2 ? 'Cancelled' : 'Voided'}`
                );
                this.closeCancelVoidAllModal();
                this.listBets();
              } else {
                this.toastrService.error('Failed to Cancel/Void Bet');
              }
            });
        } else {
          this.toastrService.error('Invalid Password');
        }
      });
  }
  listevent() {
    this.Eventlist = [];
    this.betlistService.listevent(`${this.fromDate} ${this.fromTime}`, `${this.toDate} ${this.toTime}`).subscribe((res: GenericResponse<IUserList[]>) => {
      if (res) {
        this.Eventlist = res.result;
      }
      // console.log(this.Eventlist);
    })
  }
  filterMarketByEvent() {
    if (!this.selectedEventID) {
      return;
    }
    this.betlistService.listMarkets(this.selectedEventID, `${this.fromDate} ${this.fromTime}`, `${this.toDate} ${this.toTime}`).subscribe((res: GenericResponse<IUserList[]>) => {
      if (res) {
        this.filteredmarkets = res.result;
        //console.log(this.filteredmarkets);

      }
    })
  }

  selectEventId(eventid) {
    this.p = 1;
    this.selectedEventbyMarket = '';
    // let filterMarketByEvent = this.Eventlist?.filter((event) => {
    //   return event.eventId === eventid;
    // });
    // this.filteredmarkets=filterMarketByEvent;
    this.selectedEventID = eventid;
    this.filterMarketByEvent();
    //this.listBets();
  }

  selectEventbyMarket(eventId) {
    this.p = 1;
    this.listBets();
  }

  filterByTerm(term?: string, manual?: boolean) {
    if (manual) {
      // this.p = 1;
    }
    if (term && term != '') {
      this.filterBets();
      this.betList = this.betList.filter((bet) => {
        let agents = Object.values(bet.parentName).reduce((acc, c) => {
          acc.push(c.toLowerCase());
          return acc;
        }, []);

        return (
          bet.userName?.toLowerCase().includes(term.toLowerCase()) ||
          bet.consolidateId?.toLowerCase().includes(term.toLowerCase()) ||
          bet.ipAddress?.toLowerCase().includes(term) ||
          bet.eventName?.toLowerCase().includes(term.toLowerCase()) ||
          bet.selName?.toLowerCase().includes(term.toLowerCase()) ||
          agents.some((m) => m.includes(term.toLowerCase()))
        );
      });
      this.totalRow = new TotalRow();
      this.betList.forEach((bet) => {
        this.totalRow.Totalpnl += bet.PL;
      });

    } else {
      this.filterEvents();
      this.filterBets();
    }
  }

  pageChanged(event) {
    this.p = event;
    this.listBets()
  }

  // filterMarketByEvent(eventId) {
  //   this.filtered = [];

  //   this.selectedEvent = eventId;
  //   this.marketList = this.betListHolder?.filter(
  //     (market) => market.eventId == this.selectedEvent
  //   );
  // //  console.log('marketList', this.marketList);
  //   let newMarketList = Array.from(
  //     new Set(this.marketList.map((a) => a.selName))
  //   ).map((name) => {
  //     return this.marketList.find((a) => a.selName === name);
  //   });
  // //  console.log(newMarketList, 'marketlist');

  //   let getArray = Array.from(new Set(newMarketList.map((a) => a.selName))).map(
  //     (name) => {
  //       return this.marketList.filter((a) => a.selName === name);
  //     }
  //   );

  //   let afterRemoved = Array.from(
  //     new Set(newMarketList.map((a) => a.selName))
  //   ).map((name) => {
  //     return this.marketList.filter((a) => a.selName === name);
  //   });

  //   for (var i = 0; i < afterRemoved.length; i++) {
  //     this.filtered.push(afterRemoved[i][0].selName);
  //   }

  // //  console.log(this.filtered, 'Filtered things');
  // }

  selectMarket(selName) {
    if (selName !== '0') {
      this.selectedConsolidate = selName;
      this.betList = this.marketList?.filter(
        (market) => market.selName == this.selectedConsolidate
      );
    } else {
      this.selectEvent(this.selectedEvent);
    }

    //  console.log('selected bet');
  }

  trackByIndex(index) {
    return index;
  }

  getFullEventName(bet) {
    return `${bet.sportName} > ${bet.tounamentName} > ${bet.eventName} > ${bet.marketName}`;
  }

  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }

  ngOnDestroy() {
    this.betListSub.unsubscribe();
    if (this.fullHirarchySub) {
      this.fullHirarchySub.unsubscribe();
    }
  }
}
