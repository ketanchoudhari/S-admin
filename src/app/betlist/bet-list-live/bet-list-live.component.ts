import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, timer } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { BetlistService } from '../betlist.service';
import { LiveBet } from '../types/live-bet';
import * as bcrypt from 'bcryptjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { DatePipe } from '@angular/common';
import { IUserList } from 'src/app/users/models/user-list';
import { UsersService } from 'src/app/users/users.service';
import { ShareDataService } from 'src/app/services/share-data.service';

export interface IEventFilter {
  eventId: string;
  eventName: string;
  sportIds: number[];
  sportName: string;
}

@Component({
  selector: 'app-bet-list-live',
  templateUrl: './bet-list-live.component.html',
  styleUrls: ['./bet-list-live.component.scss'],
})
export class BetListLiveComponent implements OnInit, OnDestroy {
  timeFormat = environment.timeFormat;
  fromDate;
  fromTime;
  toDate;
  toTime;
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  liveBetsList: LiveBet[];
  liveBetsListHolder: LiveBet[];

  activeEvents: IEventFilter[];
  activeEventsHolder: IEventFilter[];
  selectedVoidCancelBet = [];
  betIds = [];
  eventsMap = {};
  refreshInterval = 15;

  p = 1;
  n = 100;

  isVoidBetModalOpen: boolean = false;
  isCancelBetModalOpen: boolean = false;

  isVoidAllBetModalOpen: boolean = false;
  isCancelAllBetModalOpen: boolean = false;
  isBdlevel=environment.isBdlevel;
  selectedBet: LiveBet = null;
  timerSubscription: Subscription;
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
  selectedCurrency:string='';
  // sportFilterList = [
  //   { id: 1, name: 'Soccer' },
  //   { id: 2, name: 'Tennis' },
  //   { id: 41, name: 'Cricket' },
  //   { id: 52, name: 'Kabaddi' },
  //   { id: 4, name: 'Cricket Exchange' },
  //   { id: -2, name: 'Cricket Fancy' },
  //   { id: -1012, name: 'Virtual Cricket' },
  //   // { id: 'teenpatti', name: 'Live Casino' },
  //   { id: "-90", name: 'Live Casino' },
  //   // { id: 'x', name: 'X-Games' },
  //   { id: 74, name: 'Races' },
  //   { id: 7, name: 'Horse Racing' },
  //   { id: 4339, name: 'Greyhound Racing' },
  //   // { id: -302,fillname:'election', name: 'Election' },
  // ];
  sportFilterList = [
    { id: 1, fillname: 'soccer', name: 'Soccer' },
    { id: 2, fillname: 'tennis', name: 'Tennis' },
    { id: 4, fillname: 'cricket', name: 'Cricket' },
    //{ id: 4, name: 'Cricket Exchange' },
    //{ id: -2,fillname:'fancy', name: 'Cricket Fancy' },
    { id: 'premium',fillname: 'premium', name: 'Premium' },
    // { id: -1,fillname:'bookmaker', name: 'Bookmaker' },
    //{ id: -1012,fillname:'virtual', name: 'Virtual Cricket' },
    { id: 'teenpatti', fillname: 'teenpatti', name: 'Live Casino' },
    { id: 7, fillname: 'horseracing', name: 'Horse Racing' },
    { id: 'x',fillname: 'x-games', name: 'X-Games' },
    //{ id: 74, name: 'Races' },
    { id: 4339, fillname: 'greyhound', name: 'Greyhound Racing' },
    { id: 42, fillname: 'kabaddi', name: 'Kabaddi' },
    { id: 43,fillname:'election', name: 'Election' },
    { id: 43,fillname:'Basketball', name: 'Basketball' },
    { id: 43,fillname:'Volleyball', name: 'Volleyball' },
    { id: 43,fillname:'Snooker', name: 'Snooker' },
    { id: 43,fillname:'Motor Sport', name: 'Motor Sport' },
    { id: 43,fillname:'Ice Hockey', name: 'Ice Hockey' },
    { id: 43,fillname:'Golf ', name: 'Golf' },
    { id: 43,fillname:'Esports', name: 'Esports' },
    { id: 43,fillname:'Darts', name: 'Darts' },
    { id: 43,fillname:'Cycling', name: 'Cycling' },
    { id: 43,fillname:'Boxing', name: 'Boxing' },
    { id: 43,fillname:'american footbal', name: 'American Football' },
    { id: 43,fillname:'Gaelic Games', name: 'Gaelic Games' },
    { id: 43,fillname:'Handball', name: 'Handball' },
    { id: 43,fillname:'Rugby League', name: 'Rugby League' },
    { id: 43,fillname:'Rugby Union', name: 'Rugby Union' },
    { id: 43,fillname:'Australian Rules', name: 'Australian Rules' },
    { id: 43,fillname:'Politics', name: 'Politics' },
    { id: 43,fillname:'Kabaddi', name: 'Kabaddi' },
    { id: 43,fillname:'Winter Sports', name: 'Winter Sports' },
    { id: 43,fillname:'Mixed Martial Arts', name: 'Mixed Martial Arts' },
  ];
  fullHirarchySub:Subscription;
  usersList:any = [];
  searchUsername: any = "";
  searchbetId: string = '';
  selectedEventbyMarket = '';
  selectedEventID: string = '';
  selectedSport: string = '';
  Eventlist = [];
  selectedEvent: string = '0';
  filteredEventlist = [];
  filteredmarkets = [];
  statusList = [
    { id: 0, name: 'Open' },
    { id: 1, name: 'Settled' },
    { id: 2, name: 'Cancelled' },
    { id: 3, name: 'Voided' },
  ];
  selectedStatus: { id: number; name: string } = this.statusList[0];
  selectedMarket = '0';
  selectedConsolidate = '0';
  Volumecheck: any = "0";
  isLoaded: boolean = false;
  order: number = 2;
  orderByColumn: number = 3;
  currentUser: any;
  showActions: boolean;
  searchTerm: string;
  filtered;
  marketList;
  betlistCount:number;
  siteName = environment.siteName;

  heirarchyMap = {
    2: 'WL ID',
    3: 'AD ID',
    4: 'SA ID',
    5: 'SM ID',
    6: 'MA ID',
    7: 'AG ID',
  };
  voidForm: FormGroup;
  cancelForm: FormGroup;

  nextCall$ = new Subject();
  isInTransit: boolean = false;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  showtpfilter: boolean=false;
  showslcdata: boolean=false;
  showstcdata: boolean=false;
  liveBetsListdata: LiveBet[];
  hidevoid: boolean =true;
  isVrnladmin: boolean = false;
  month;
  Update: any;
  constructor(
    private datePipe: DatePipe,
    private usersService: UsersService,
    private betlistService: BetlistService,
    private loadingService: LoadingService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private envService: EnvService,
    private formBuilder: FormBuilder,
    private shareService: ShareDataService
  ) { 
    this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
    this.dateConfig = {
      format: 'YYYY-MM-DD',
      min: this.month,

    };

    this.fromDate = datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd');
    this.fromTime = datePipe.transform(new Date().setHours(new Date().getHours() - 4), 'HH:mm:ss');

    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    this.toTime = datePipe.transform(new Date().setHours(new Date().getHours() + 2), 'HH:mm:ss');

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
      this.listevent();
      this.listUser();
      this.timerSubscription = timer(0, this.refreshInterval * 1000).pipe(
        map(() => {
          if (this.selectedVoidCancelBet?.length == 0) {
            this.listLiveBets();
          }
          // if(this.showslcdata==true){
          //   this.showslc();
            
          // }
          // if(this.showstcdata==true){
          //   this.showstc();
          // }
       
        })
      ).subscribe();
    });


    this.currentUser = this.authService.currentUser;
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    let showActions = this.envService.environment.showVoidCancel;
    this.commonService.hierarchyMap$.subscribe((map) => {
      // this.hierarchyMap = map;
      if (this.currentUser.userType === this.commonService.vrnlUserType) {
        this.isVrnladmin = true;
      }
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
    });

    // this.eventsService
    //   .activateListGame()
    //   .subscribe((res: GenericResponse<IEvent[]>) => {
    //     this.activeEventsHolder = res.result;
    //     this.activeEvents = Object.assign([], res.result);

    //   });

    this.voidForm = this.formBuilder.group({
      password: ['', Validators.required],
    });

    this.cancelForm = this.formBuilder.group({
      password: ['', Validators.required],
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
  confirmDelete(selectedBet){
    if (this.selectedVoidCancelBet.indexOf(selectedBet) > -1) {
      this.selectedVoidCancelBet.splice(this.selectedVoidCancelBet.indexOf(selectedBet), 1);
      selectedBet.activeStatus = false;
    }
  }

  listLiveBets() {
    // this.loadingService.setLoading(true);
    if (!this.isLoaded) {
      this.isLoaded = true;
      this.loadingService.setLoading(true);
    }

    if (!this.isInTransit) {
      this.isInTransit = true;
      this.betlistService
        .listLiveBets2(
          this.selectedStatus.id,
          this.p,
          this.n,
          this.selectedSport,
          this.selectedEventID,
          this.selectedEventbyMarket,
          +this.Volumecheck,
          this.searchUsername,
          this.selectedCurrency
        )
        .subscribe((res: GenericResponse<LiveBet[]>) => {
          this.isInTransit = false;
          if (res.errorCode === 0) {
            let Logcount = res.result[0];
            this.betlistCount = Logcount.count;
            if (this.selectedVoidCancelBet.length == 0) {
              this.liveBetsListHolder = res.result.slice(1);
              this.liveBetsList = Object.assign(
                [],
                this.datewisedescending(res.result.slice(1))
              );
              //this.liveBetsList = res.result.slice(1);
              
              res.result.slice(1).forEach((bet) => {
                bet.activeStatus = false;
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
              this.activeEventsHolder = Object.values(this.eventsMap);
              this.activeEvents = Object.assign([], this.activeEventsHolder);
              // this.filterEvents();
              // this.orderOfDisplay();
              this.filterBets();
              //console.log(this.liveBetsList,"")
              this.filterByTerm(this.searchTerm);
              // if (this.selectedEvent !== '0') {
              //   this.filterMarketByEvent(this.selectedEvent);
              //   if (this.selectedConsolidate !== '0') {
              //     if (this.selectedEvent == this.selectedEvent) {
              //       this.selectMarket(this.selectedConsolidate);
              //     }
              //   }
              // }
            }
          }
          this.loadingService.setLoading(false);
        },error => {
          this.isInTransit = false;
        });
       
    }
  }

  closeBoth(){
    this.isCancelBetModalOpen = false;
    this.isVoidBetModalOpen = false;
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

  changeRefreshInterval(value: number) {
    this.refreshInterval = +value;
    if (this.refreshInterval === 0) {
      return;
    }
    this.timerSubscription.unsubscribe();
    // console.log(this.refreshInterval);
    this.timerSubscription = timer(0, this.refreshInterval * 1000).pipe(
      map(() => {
        this.listLiveBets();
      })
    ).subscribe();
  }

  selectSport(sportId: string, manual?: boolean) {
    if (manual) {
      this.p = 1;
    }
    this.selectedSport = sportId;
    this.selectedEvent = '0';
    this.selectedMarket = '0';
    this.selectedConsolidate = '0';
    this.filtered = [];
    console.log(this.selectedSport)
    // this.filterEvents();
    // this.filterBets();
    // this.orderOfDisplay();
    //this.filterByTerm(this.searchTerm);
    // this.marketList="0"
    
    this.showslcdata =false
    this.showstcdata=false;
    // console.log(this.showslcdata)
    if (this.selectedSport=='teenpatti'){
      this.showtpfilter=true
      console.log (this.showtpfilter=true)
    }
    else{
      this.showtpfilter=false
    }
    if (this.selectedSport=='greyhound' || this.selectedSport=='horseracing' || this.selectedSport=='teenpatti'){
      this.hidevoid=false
    }
    else{
      this.hidevoid=true
    }
  }

  selectEvent(eventId, manual?: boolean) {
    if (manual) {
      this.p = 1;
    }
    this.selectedEvent = eventId;
    this.selectedMarket = '0';
    this.selectedConsolidate = '0';
    this.filtered = [];
    this.filterBets();
    this.filterByTerm(this.searchTerm);
    
    this.showslcdata =false
    this.showstcdata=false;
    // this.filterMarketByEvent(eventId);
  }
  selectCurrency(currency){
    this.selectedCurrency = currency;
  }

  filterEvents() {
    if (this.selectedSport === '0' || this.selectedSport === '') {
      this.activeEvents = this.activeEventsHolder;
    } else if (+this.selectedSport === 41) {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportName.toLowerCase().includes('cricket');
      });
    } else if (+this.selectedSport === 52) {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportName.toLowerCase().includes('kabaddi');
      });
    } else if (+this.selectedSport === 74) {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportIds[7] || event.sportIds[4339];
      });
    } else if (+this.selectedSport === -1012) {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportIds[-101] || event.sportIds[-102];
      });
    } else if (this.selectedSport == 'x') {
      this.activeEvents = this.activeEventsHolder?.filter((event) => {
        return +event.sportName.toLowerCase().includes('exchange games');
      });
    } 
    else if (this.selectedSport === 'teenpatti') {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportName.toLowerCase().includes('live casino');
      });
    }
  }

  filterBets() {
    if (+this.selectedSport == 0) {
      this.liveBetsList = this.liveBetsListHolder;
    } else if (+this.selectedSport === 41) {
      this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
        return bet.sportName.toLowerCase().includes('cricket');
      });
    } else if (+this.selectedSport === 52) {
      this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
        return bet.sportName.toLowerCase().includes('kabaddi');
      });
    } else if (this.selectedSport === 'teenpatti') {
      this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
        return bet.sportName.toLowerCase().includes('live casino');
      });
    } else if (+this.selectedSport === 74) {
      this.liveBetsList = this.liveBetsListHolder.filter((bet) => {
        return +bet.sportId == 7 || +bet.sportId == 4339;
      });
    } else if (+this.selectedSport === -1012) {
      this.liveBetsList = this.liveBetsListHolder.filter((bet) => {
        return +bet.sportId == -101 || +bet.sportId == -102;
      });
    } else if (this.selectedSport === 'x') {
      this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
        return bet.sportName.toLowerCase().includes('exchange games');
      });
    }
    // else if (this.selectedSport === 'premium') {
    //   this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
    //     return bet.consolidateId.match('P-') && bet.sportId == "0";
    //   });
    // } 
    else {
      this.liveBetsList = this.liveBetsListHolder;
      this.activeEvents = this.activeEventsHolder.filter(
        (bet) => +bet.sportIds[+this.selectedSport]
      );
    }

    if (+this.selectedEvent === 0) {
      this.liveBetsList = this.liveBetsList;
    } else {
      this.liveBetsList = this.liveBetsListHolder;
    }
    // if (this.liveBetsList?.length < this.n) {
    //   this.p = 1;
    // }
  }

  // filterMarketByEvent(eventId) {
  //   this.filtered = [];

  //   this.selectedEvent = eventId;
  //   this.marketList = this.liveBetsListHolder?.filter(
  //     (market) => market.eventId == this.selectedEvent
  //   );
  //   let newMarketList = Array.from(
  //     new Set(this.marketList.map((a) => a.selName))
  //   ).map((name) => {
  //     return this.marketList.find((a) => a.selName === name);
  //   });

  //   let afterRemoved = Array.from(
  //     new Set(newMarketList.map((a) => a.selName))
  //   ).map((name) => {
  //     return this.marketList.filter((a) => a.selName === name);
  //   });

  //   for (var i = 0; i < afterRemoved.length; i++) {
  //     this.filtered.push(afterRemoved[i][0].selName);
  //   }
  // }

  selectMarket(selName, manual?: boolean) {
    this.showslcdata =false
    this.showstcdata=false;
    
    if (manual) {
      this.p = 1;
    }
    if (selName !== '0') {
      this.selectedConsolidate = selName;
      this.liveBetsList = this.marketList?.filter(
        (market) => market.selName == this.selectedConsolidate
      );
    } else {
      this.selectEvent(this.selectedEvent);
    }

    //  console.log('selected bet');
  }

  selectNoRows(numberOfRows: number) {

    // this.liveBetsList.forEach((bet) => (bet.activeStatus = false));
    this.selectedVoidCancelBet = [];
    this.p = 1;
    this.n = +numberOfRows;
    this.uncheckAll();
    this.listLiveBets();
  }
  pageChanged(event){
    this.p=event;
    this.listLiveBets();
  }

  listUser() {
    // this.fullHirarchySub = this.commonService._allUsersSub$.subscribe((res)=>{
    //   if (res) {
    //     this.usersList=res
    //   }
    // })
    this.usersService
    .userbyBetslist(`${this.fromDate} ${this.fromTime}`, `${this.toDate} ${this.toTime}`)
    .subscribe((res: GenericResponse<IUserList[]>) => {
      if (res) {
        this.usersList = res.result;
        // this.loadingService.setLoading(false);
      }
    });
  }
  
  selectEventId(eventid) {
    this.showslcdata =false
    this.showstcdata=false;
    this.p = 1;
    this.selectedEventID = eventid;
    this.selectedEventbyMarket = '';
    this.filterMarketByEvent();
    // this.listBets();
  }

  listevent() {
    this.Eventlist = [];
    this.filteredEventlist = [];
    // this.betlistService.listevent(`${this.fromDate} ${this.fromTime}`, `${this.toDate} ${this.toTime}`).subscribe((res: GenericResponse<IUserList[]>) => {
    //   if (res) {
    //     this.Eventlist = res.result;
    //     if (res) {
    //       this.Eventlist = res.result;
    //       this.Eventlist.forEach((event, index) => {
    //         if (!this.filteredEventlist.some(e => (e['eventId'] === event.eventId)))
    //           this.filteredEventlist.push(event);
    //       })
    //     }
    //   }
    // })

     this.betlistService.listevent2().subscribe((res: GenericResponse<IUserList[]>) => {
      if (res) {
        this.Eventlist = res.result;
        if (res) {
          this.Eventlist = res.result;
          this.Eventlist.forEach((event, index) => {
            if (!this.filteredEventlist.some(e => (e['eventId'] === event.eventId)))
              this.filteredEventlist.push(event);
          })
        }
      }
    })
  }

  filterMarketByEvent(){
    // this.betlistService.listMarkets(this.selectedEventID,`${this.fromDate} ${this.fromTime}`,`${this.toDate} ${this.toTime}`).subscribe((res: GenericResponse<IUserList[]>)=>{
    //   if (res) {
    //     this.filteredmarkets = res.result;
    //     console.log(this.filteredmarkets);
        
    //   }
    // })
    if(!this.selectedEventID){
      return;
    }
    this.betlistService.listMarkets2(this.selectedEventID).subscribe((res: GenericResponse<IUserList[]>)=>{
      if (res) {
        this.filteredmarkets = res.result;
        console.log(this.filteredmarkets);
        
      }
    })
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  orderBy(column: number) {
    this.orderByColumn = +column;
    this.orderOfDisplay();
  }

  selectOrder(order: number) {
    this.order = +order;
    this.orderOfDisplay();
  }

  orderOfDisplay() {
    if (this.orderByColumn === 1) {
      this.liveBetsList = this.liveBetsList.sort((a, b) => {
        return this.order === 1 ? a.stake - b.stake : b.stake - a.stake;
      });
    } else if (this.orderByColumn === 2) {
      this.liveBetsList = this.liveBetsList.sort((a, b) => {
        return this.order === 1
          ? a.userName.localeCompare(b.userName)
          : b.userName.localeCompare(a.userName);
      });
    } else if (this.orderByColumn === 3) {
      this.liveBetsList = this.liveBetsList.sort((a, b) => {
        return this.order === 1
          ? Date.parse(a.betTime) - Date.parse(b.betTime)
          : Date.parse(b.betTime) - Date.parse(a.betTime);
      });
    }
  }

  voidAll(type) {
    this.betIds = [];
    this.selectedVoidCancelBet.forEach((event, index) => {
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
        //  console.log(res, 'result');
        if (res) {
          this.betlistService.voidBets(bet, type)
            .subscribe((res: GenericResponse<any>) => {
              if (res.result !=null) {
                res.result.forEach((result)=>{
                  if(result.includes("failed")){
                    this.toastrService.error(result);
                  }
                  else{
                  this.toastrService.success(result);
                  }
                })
                this.closeCancelVoidAllModal();
                this.listLiveBets();
              }
            });
        } else {
          this.toastrService.error('Invalid Password');
        }
      });
  }

  toggleSelectAll(checked: boolean) {
    
    this.showslcdata =false
    this.showstcdata=false;
    if (checked) {
      if(this.liveBetsList.length >= this.n-1){
        for(var i=0;i<this.n;i++){
          this.liveBetsList[i].activeStatus = true;
        }
      }
      else{
        this.liveBetsList.forEach((bet) => (bet.activeStatus = true));
      }
      this.selectedVoidCancelBet = this.liveBetsList.filter((bet) => {
        return bet.activeStatus == true;
      });
    } else {
      this.liveBetsList.forEach((bet) => (bet.activeStatus = false));
      this.selectedVoidCancelBet = [];
    }
  }

  confirmCancelVoidAllBet(type: number) {
    if (type === 1) {
      this.isVoidAllBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelAllBetModalOpen = true;
    }
  }
  toggleSelect(checked: boolean, bet: any) {
    bet.activeStatus = checked;
    if (checked) {
      this.selectedVoidCancelBet?.push(bet);
    }
    else {
      this.selectedVoidCancelBet.splice(this.selectedVoidCancelBet.indexOf(bet), 1);
    }

  }

  confirmCancelVoidBet(bet: LiveBet, type: number) {
    this.selectedBet = bet;
    if (type === 1) {
      this.isVoidBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelBetModalOpen = true;
    }
  }

  cancelVoidBet(type: number) {
    // console.log(this.voidForm.value.password, localStorage.getItem('password'));
    let comparePassword = bcrypt
      .compare(this.voidForm.value.password, localStorage.getItem('password'))
      .then((res) => {
        //  console.log(res, 'result');
        if (res) {
          this.betlistService
            .cancelVoidBets(bet, type)
            .subscribe((res: GenericResponse<any>) => {
              if (res.result !=null) {
               res.result.forEach((result)=>{
                   if(result.includes("failed")){
                    this.toastrService.error(result);
                  }
                  else{
                  this.toastrService.success(result);
                  }
                })
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
              if (res.result !=null) {
                res.result.forEach((result)=>{
                   if(result.includes("failed")){
                    this.toastrService.error(result);
                  }
                  else{
                  this.toastrService.success(result);
                  }
                })
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
    this.liveBetsList.forEach((event) => (event.activeStatus = false));
    this.uncheckAll();
  }
  filterByTerm(term?: string, manual?: boolean) {
    if (manual) {
      this.p = 1;
    }
    if (term && term != '') {
      this.filterBets();
      this.liveBetsList = this.liveBetsList?.filter((bet) => {
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
    } else {
      this.filterEvents();
      this.filterBets();
      this.orderOfDisplay();
    }
  }

  getFullEventName(bet) {
    return `${bet.sportName} > ${bet.tounamentName} > ${bet.eventName} > ${bet.marketName}`;
  }

  trackById(index, item: LiveBet) {
    return item.consolidateId;
  }

  trackByIndex(index) {
    return index;
  }

  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }

  ngOnDestroy() {
    if(this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
    if(this.fullHirarchySub){
      this.fullHirarchySub.unsubscribe();
    }
  }
}
