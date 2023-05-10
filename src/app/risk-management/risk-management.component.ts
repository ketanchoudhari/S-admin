import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IEventFilter } from '../betlist/bet-list-live/bet-list-live.component';
import { BetlistService } from '../betlist/betlist.service';
import { EnvService } from '../env.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { IUserList } from '../users/models/user-list';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RiskmanagementService } from './riskmanagement.service';
import { IBtlist } from './types/IBetlist';

export interface IActiveIp {
  activeIP: string;
  Uname: string;
}

export interface IriskIP{
  IP: string;
}
export class TotalRow {
  constructor(
    public totalDepositDownline: number = 0,
    public totalDepositUpline: number = 0,
    public totalWithdrawUpline: number = 0,
    public totalWithdrawDownline: number = 0,
    public totalBalance: number = 0
  ) { }
}
@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss']
})

export class RiskManagementComponent implements OnInit, OnDestroy {
  timeFormat = environment.timeFormat;
  siteName = environment.siteName;

  fromDate;
  fromTime;
  toDate;
  toTime;
  refreshInterval = 15;
  totalRow = new TotalRow();
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  Volumecheck:any ="0";
  isVoidBetModalOpen: boolean = false;
  isCancelBetModalOpen: boolean = false;
  isCheatBetModelOpen: boolean = false;
  clickedRiskIp:boolean = false;

  selectedBet: IBtlist = null;
  sportFilterList = [
    { id: 1,fillname:'soccer', name: 'Soccer' },
    { id: 2,fillname:'tennis', name: 'Tennis' },
    { id: 4, fillname:'cricket',name: 'Cricket' },
    // { id: 41, name: 'Cricket Exchange' },
    // { id: -2,fillname:'fancy', name: 'Cricket Fancy' },
    // { id: -1012,fillname:'virtual', name: 'Virtual Cricket' },
    // { id: 'teenpatti', fillname:'teenpatti', name: 'Live Casino' },
    // { id: 'x',fillname:'xgames', name: 'X-Games' },
    // { id: 74, name: 'Races' },
    // { id: 7,fillname:'horseracing', name: 'Horse Racing' },
    // { id: 4339,fillname:'greyhound', name: 'Greyhound Racing' },
    // { id: 42,fillname:'kabaddi', name: 'Kabaddi' },
    // { id: 43,fillname:'election', name: 'Election' },
  ];
  selectedSport: string = '';
  selectedEvent: string = '0';
  selectedIP:any = '0';
  usersList=[];
  searchUsername:any = "";
  searchbetId:string = '';

  selectedMarket = '0';
  selectedConsolidate = '0';
  eventsMap = {};
  activeEvents: IEventFilter[];
  activeEventsHolder: IEventFilter[];

  activeIps:IBtlist[];
  riskIps:IBtlist[];
  p: number = 1;
  n: number = 100;
  statusList = [
    { id: 4, name: 'All' },
    { id: 1, name: 'Settled' },
    { id: 2, name: 'Cancelled' },
    { id: 3, name: 'Voided' },
  ];
  selectedStatus: { id: number; name: string } = this.statusList[1];

  betList: IBtlist[];
  betListHolder: IBtlist[];
  cheatBets:any;
  cheaterInfo:any;
  currentUser: CurrentUser;
  showActions: boolean = true;
  searchTerm: string;
  betlistCount:any;
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
  timerSubscription: Subscription;
  voidForm: FormGroup;
  cancelForm: FormGroup;
  isInTransit: any;
  userid: any=0;
  lastuser: any;
  month;
  isBdlevel=environment.isBdlevel;
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
    private riskmanagement:RiskmanagementService
  ) {
    this.lastuser= localStorage.getItem('lastuser')
    this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
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

    this.toDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toTime = datePipe.transform(new Date(), 'HH:mm:ss');

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
      min:'2022-01-01 15:50',
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
    this.commonService.apis$.subscribe((res) => {
      // this.listUser();
      if (this.lastuser) {
        this.listUser();
      }
    });
    this.timerSubscription = timer(0, 15000).pipe( 
      map(() => { 
        this.listBets();
      }) 
    ).subscribe(); 
    this.currentUser = this.authService.currentUser;
    this.commonService.hierarchyMap$.subscribe((res) => {
      if (
        this.currentUser.userType !== this.commonService.vrnlUserType &&
        this.currentUser.userType !== this.commonService.whitelabelUserType &&
        this.currentUser.userType !== this.commonService.adminUserType
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
      if (
        this.currentUser.userType === this.commonService.whitelabelUserType ||
        this.currentUser.userType === this.commonService.vrnlUserType ||
        (this.currentUser?.userType == this.commonService.adminUserType &&
          showActions)
      ) {
        this.showActions = true;
      } else {
        this.showActions = false;
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

  selectNoRows(numberOfRows: number) {
    this.p = 1;
    this.n = +numberOfRows;
  }

  listBets() {
    this.loadingService.setLoading(true);

    if (!this.isInTransit) {
      this.isInTransit = true;
      this.riskmanagement
        .listCheaters(
          `${this.fromDate} ${this.fromTime}`,
          `${this.toDate} ${this.toTime}`,
          '',
          this.selectedSport,
          this.searchUsername,
          this.searchbetId
        )
        .subscribe((res: IBtlist[]) => {
          this.isInTransit = false;
          this.betlistCount = res.length;
          this.betList=res;
          
          this.loadingService.setLoading(false);
          if (res) {
            this.betListHolder = res;
            this.betList = Object.assign(
              [],
              this.datewisedescending(res)
            );
           
           res.forEach((bet) => {
              let event: IEventFilter = {
                eventId: bet.eventId,
                eventName: bet.eventName,
                sportIds: {
                  ...(this.eventsMap[bet.eventId]
                    ? this.eventsMap[bet.eventId].sportIds
                    : {}),
                  [bet.eventTypeId]: true,
                },
                sportName: bet.sportName,
              };
              this.eventsMap[event.eventId] = event;
            });
            this.activeEventsHolder = Object.values(this.eventsMap);
            this.activeEvents = Object.assign([], this.activeEventsHolder);
            this.betList = this.betListHolder;
            // this.selectSport(this.selectedSport);
            // this.selectEvent(this.selectedEvent);
            this.filterEvents();
            this.filterBets();
            this.filterByTerm(this.searchTerm);
            this.Listips(this.betListHolder);
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
    this.listBets();
  }

  confirmCancelVoidBet(bet: IBtlist, type: number) {
    this.selectedBet = bet;
    if (type === 1) {
      this.isVoidBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelBetModalOpen = true;
    }
  }

  confirmCheatbets(bet: IBtlist) {
    this.selectedBet = bet;
    this.isCheatBetModelOpen = true;
    this.riskmanagement
            .cheaters(bet.consolidateId)
            .subscribe((res) => {
              this.cheatBets = res;
              this.cheaterInfo = this.cheatBets?.cheater;
            });   
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
    this.filterMarketByEvent(eventId);
  }

  selectIP(ip) {
    this.filterBets();
  }

  Listips(betlist){
    this.activeIps=[];
    for (var i = 0; i < betlist.length; i++) {
     if(!this.activeIps.find( ip => ip['ipAddress'] === betlist[i].ipAddress )){
        this.activeIps.push(betlist[i]);
      }
    }
  }

  getriskIP(){
    this.clickedRiskIp=true;
    this.riskIps=[];
    for (var i = 0; i < this.betListHolder.length; i++) {
      if(this.activeIps.find((ip => (ip['ipAddress'] === this.betListHolder[i].ipAddress) && (ip['selName'] === this.betListHolder[i].selName) && (ip['eventName'] === this.betListHolder[i].eventName) && (ip['userName'] !== this.betListHolder[i].userName)))){
          if(!this.riskIps.some(ip => (ip['ipAddress'] === this.betListHolder[i].ipAddress)))
            this.riskIps.push(this.betListHolder[i]);
      }
    }
    //  console.log(this.riskIps);
  }

  filterBets() {
    
    if (+this.selectedSport == 0) {
      console.log(this.Volumecheck);
      
      this.betList = this.betListHolder?.filter(
        (bet) => bet.stake >= this.Volumecheck
      );
    } 
    else {
      this.betList = this.betListHolder?.filter(

        (bet) => +bet.eventTypeId === +this.selectedSport  && bet.stake >= this.Volumecheck
      );
      this.activeEvents = this.activeEventsHolder.filter(
        (bet) => +bet.sportIds[+this.selectedSport]
      );
    }

    if (+this.selectedEvent === 0) {
      this.betList = this.betList;
    } else {
      if(+this.selectedConsolidate!=0)
      this.betList = this.betListHolder.filter(
        (bet) => bet.eventId === this.selectedEvent && bet.selName == this.selectedConsolidate && bet.stake >= this.Volumecheck
      );
      else
      this.betList = this.betListHolder.filter(
        (bet) => bet.eventId === this.selectedEvent && bet.stake >= this.Volumecheck
      );
    }
    
    if(this.selectedIP!="0"){
      this.betList = this.betList?.filter(
        (bet) => bet.ipAddress === this.selectedIP.ipAddress && bet.selName == this.selectedIP.selName && bet.stake >= this.Volumecheck
      );
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
    // this.p=1;
    this.listBets()
  }

  filterBybetId(term?: string) {
    this.p=1;
    this.listBets()
  }

  filterbySport(sportId) {
    this.selectedSport = sportId;
    this.p = 1;
    this.listBets();
    this.filterEvents();
    this.filterBets();
    this.filterByTerm(this.searchTerm);
  }

  listUser() {
    this.usersService
      .fullHierarchy2(this.lastuser)
      .subscribe((res: GenericResponse<IUserList[]>) => {
        if (res) {
          this.usersList = res.result;
          this.loadingService.setLoading(false);
        }
      });
  }

  filterByTerm(term?: string, manual?: boolean) {
    if (manual) {
      // this.p = 1;
    }
    if (term && term != '') {
      this.filterBets();
      this.betList = this.betList.filter((bet) => {

        return (
          bet.userName?.toLowerCase().includes(term.toLowerCase()) ||
          bet.consolidateId?.toLowerCase().includes(term.toLowerCase()) ||
          bet.ipAddress?.toLowerCase().includes(term) ||
          bet.eventName?.toLowerCase().includes(term.toLowerCase()) ||
          bet.selName?.toLowerCase().includes(term.toLowerCase())
        );
      });
      
    } else {
      this.filterEvents();
      this.filterBets();
    }
  }

  pageChanged(event){
    this.p=event;
    this.listBets()
  }

  filterMarketByEvent(eventId) {
    this.filtered = [];

    this.selectedEvent = eventId;
    this.marketList = this.betListHolder?.filter(
      (market) => market.eventId == this.selectedEvent
    );
  //  console.log('marketList', this.marketList);
    let newMarketList = Array.from(
      new Set(this.marketList.map((a) => a.selName))
    ).map((name) => {
      return this.marketList.find((a) => a.selName === name);
    });
  //  console.log(newMarketList, 'marketlist');

    let getArray = Array.from(new Set(newMarketList.map((a) => a.selName))).map(
      (name) => {
        return this.marketList.filter((a) => a.selName === name);
      }
    );

    let afterRemoved = Array.from(
      new Set(newMarketList.map((a) => a.selName))
    ).map((name) => {
      return this.marketList.filter((a) => a.selName === name);
    });

    for (var i = 0; i < afterRemoved.length; i++) {
      this.filtered.push(afterRemoved[i][0].selName);
    }

  //  console.log(this.filtered, 'Filtered things');
  }

  selectMarket(selName) {
    if (selName !== '0') {
      this.selectedConsolidate = selName;
      // this.betList = this.marketList?.filter(
      //   (market) => market.selName == this.selectedConsolidate
      // );
      this.filterBets();
      console.log(this.selectedConsolidate);
      
    } else {
      this.selectEvent(this.selectedEvent);
    }

  //  console.log('selected bet');
  }

  trackByIndex(index) {
    return index;
  }

  getFullEventName(bet) {
    return `${bet.sportName} > ${bet.eventName} > ${bet.marketName}`;
  }

  getFullEventdetails(bet) {
    return `${bet.eventId} > ${bet.marketId}`;
  }

  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }
}
