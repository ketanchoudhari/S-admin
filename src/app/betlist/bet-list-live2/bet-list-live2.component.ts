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

export interface IEventFilter {
  eventId: string;
  eventName: string;
  sportIds: number[];
  sportName: string;
}

@Component({
  selector: 'app-bet-list-live2',
  templateUrl: './bet-list-live2.component.html',
  styleUrls: ['./bet-list-live2.component.scss'],
})
export class BetListLive2Component implements OnInit, OnDestroy {
  timeFormat = environment.timeFormat;
  liveBetsList: LiveBet[];
  liveBetsListHolder: LiveBet[];

  activeEvents: IEventFilter[];
  activeEventsHolder: IEventFilter[];

  eventsMap = {};
  refreshInterval = 15;
  betlistCount:number;
  p = 1;
  n = 100;

  isVoidBetModalOpen: boolean = false;
  isCancelBetModalOpen: boolean = false;

  isVoidAllBetModalOpen: boolean = false;
  isCancelAllBetModalOpen: boolean = false;

  selectedVoidCancelBet = [];
  betIds = [];
  statusList = [
    { id: 0, name: 'Open' },
    { id: 1, name: 'Settled' },
    { id: 2, name: 'Cancelled' },
    { id: 3, name: 'Voided' },
  ];
  selectedStatus: { id: number; name: string } = this.statusList[0];
  selectedBet: LiveBet = null;
  timerSubscription: Subscription;
  sportFilterList = [
    { id: 1, name: 'Soccer' },
    { id: 2, name: 'Tennis' },
    { id: 41, name: 'Cricket' },
    { id: 52, name: 'Kabaddi' },
    { id: 4, name: 'Cricket Exchange' },
    { id: -2, name: 'Cricket Fancy' },
    { id: 'premium', name: 'Premium' },
    { id: -1012, name: 'Virtual Cricket' },
    { id: 'teenpatti', name: 'Live Casino' },
    { id: 'x', name: 'X-Games' },
    { id: 74, name: 'Races' },
    { id: 7, name: 'Horse Racing' },
    { id: 4339, name: 'Greyhound Racing' },
    { id: -302, fillname: 'election', name: 'Election' },
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
  selectedCurrency:string='';
  selectedSport: string = '0';
  selectedEvent: string = '0';

  selectedMarket = '0';
  selectedConsolidate = '0';
  isLoaded: boolean = false;
  order: number = 2;
  orderByColumn: number = 3;
  currentUser: any;
  showActions: boolean;
  searchTerm: string;
  filtered;
  marketList;
  siteName = environment.siteName;

  heirarchyMap = {
    2: 'WL ID',
    3: 'AD ID',
    4: 'SA ID',
    5: 'SM ID',
    6: 'MA ID',
    7: 'AG ID',
  };
  isBdlevel=environment.isBdlevel;
  voidForm: FormGroup;
  cancelForm: FormGroup;
  selectedEventbyMarket = '';
  selectedEventID: string = '';
  selectedSport1: string = '';
  Volumecheck: any = "0";
  nextCall$ = new Subject();
  isInTransit: boolean = false;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  constructor(
    private betlistService: BetlistService,
    private loadingService: LoadingService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private envService: EnvService,
    private formBuilder: FormBuilder
  ) { 
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
      this.timerSubscription = timer(0, this.refreshInterval * 1000).pipe(
        map(() => {
          if (this.selectedVoidCancelBet?.length == 0) {
            this.listLiveBets();
          }
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
          this.selectedSport1,
          this.selectedEventID,
          this.selectedEventbyMarket,
          +this.Volumecheck,
          this.searchTerm,
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

              res.result.slice(1).forEach((bet) => {
                bet.activeStatus = false;
                // if(bet.sportId=='0' && bet.consolidateId.indexOf('P-')>-1){
                //   bet.sportName='premium cricket';
                // }

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
              console.log(this.selectedSport);
              
              this.filterEvents();
              this.orderOfDisplay();
              this.filterBets();
              this.filterByTerm(this.searchTerm);
              if (this.selectedEvent !== '0') {
                this.filterMarketByEvent(this.selectedEvent);
                if (this.selectedConsolidate !== '0') {
                  if (this.selectedEvent == this.selectedEvent) {
                    this.selectMarket(this.selectedConsolidate);
                  }
                }
              }
            }
          }
          this.loadingService.setLoading(false);
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
              if (res.errorCode === 0) {
                this.toastrService.success(
                  `Bet ${type == 2 ? 'Cancelled' : 'Voided'}`
                );
                this.closeCancelVoidAllModal();
                this.listLiveBets();
              } else {
                this.toastrService.error('Failed to Cancel/Void Bet');
              }
            });
        } else {
          this.toastrService.error('Invalid Password');
        }
      });
  }
  confirmDelete(selectedBet) {
    if (this.selectedVoidCancelBet.indexOf(selectedBet) > -1) {
      this.selectedVoidCancelBet.splice(this.selectedVoidCancelBet.indexOf(selectedBet), 1);
      selectedBet.activeStatus = false;
    }
  }

  toggleSelectAll(checked: boolean) {
    if (checked) {
      if (this.liveBetsList.length >= this.n - 1) {
        for (var i = 0; i < this.n; i++) {
          this.liveBetsList[i].activeStatus = true;
        }
      }
      else {
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

  closeCancelVoidAllModal() {
    this.isCancelAllBetModalOpen = false;
    this.isVoidAllBetModalOpen = false;
    this.selectedVoidCancelBet = [];
    this.liveBetsList.forEach((event) => (event.activeStatus = false));
    this.uncheckAll();
  }

  closeBoth() {
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
    console.log(this.refreshInterval);
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
    this.selectedSport1 = sportId;
    this.selectedEvent = '0';
    this.selectedMarket = '0';
    this.selectedConsolidate = '0';
    this.filtered = [];
    this.filterEvents();
    this.filterBets();
    this.orderOfDisplay();
    this.filterByTerm(this.searchTerm);
    // this.marketList="0"
  }

  selectEvent(eventId, manual?: boolean) {
    if (manual) {
      this.p = 1;
    }
    this.selectedEvent = eventId;
    this.selectedEventID = eventId;
    this.selectedMarket = '0';
    this.selectedConsolidate = '0';
    this.filtered = [];
    this.filterBets();
    this.filterByTerm(this.searchTerm);
    this.filterMarketByEvent(eventId);
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
    } else if (this.selectedSport === 'teenpatti') {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportName.toLowerCase().includes('live casino');
      });
    }else if (this.selectedSport === 'premium') {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportName.toLowerCase().includes('premium cricket');
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
    } else if (this.selectedSport === 'premium') {
      this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
        return bet.consolidateId.match('P-') && bet.sportId == "0";
      });
    } else {
      this.liveBetsList = this.liveBetsListHolder.filter(
        (bet) => +bet.sportId === +this.selectedSport
      );
      this.activeEvents = this.activeEventsHolder.filter(
        (bet) => +bet.sportIds[+this.selectedSport]
      );
    }

    if (+this.selectedEvent === 0) {
      this.liveBetsList = this.liveBetsList;
    } else {
      this.liveBetsList = this.liveBetsList.filter(
        (bet) => bet.eventId === this.selectedEvent
      );
    }
    if (this.liveBetsList?.length < this.n) {
      this.p = 1;
    }
  }

  filterMarketByEvent(eventId) {
    this.filtered = [];

    this.selectedEvent = eventId;
    this.marketList = this.liveBetsListHolder?.filter(
      (market) => market.eventId == this.selectedEvent
    );
    let newMarketList = Array.from(
      new Set(this.marketList.map((a) => a.selName))
    ).map((name) => {
      return this.marketList.find((a) => a.selName === name);
    });

    let afterRemoved = Array.from(
      new Set(newMarketList.map((a) => a.selName))
    ).map((name) => {
      return this.marketList.filter((a) => a.selName === name);
    });

    for (var i = 0; i < afterRemoved.length; i++) {
      this.filtered.push(afterRemoved[i][0].selName);
    }
  }

  selectMarket(selName, manual?: boolean) {
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
    this.liveBetsList.forEach((bet) => (bet.activeStatus = false));
    this.selectedVoidCancelBet = [];
    this.p = 1;
    this.n = +numberOfRows;
    this.uncheckAll();
    this.listLiveBets();
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
    this.timerSubscription.unsubscribe();
  }
}
