import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { ShareUserService } from 'src/app/services/share-user.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { IEventFilter } from 'src/app/betlist/bet-list-live/bet-list-live.component';
import { BetlistService } from 'src/app/betlist/betlist.service';
import { LiveBet } from 'src/app/betlist/types/live-bet';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from 'src/app/env.service';
import * as bcrypt from 'bcryptjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-casino-game',
  templateUrl: './casino-game.component.html',
  styleUrls: ['./casino-game.component.scss']
})
export class CasinoGameComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  timeFormat = environment.timeFormat;

  betlistCount: any;

  tableName: string;
  tableId: string;
  gType: string;
  tpData: any;
  tpMarkets: any = [];
  tpFMarkets: any = [];
  isLoaded: boolean = false;
  liveBetsList: LiveBet[];
  liveBetsListHolder: LiveBet[];
  casinoPnl: any = [];
  oldRoundId = 0;
  roundId = 0;
  isInTransit: boolean = false;

  lastResults = [];
  roundResult: any;
  selectedBet: LiveBet = null;

  casinoSource = interval(1000);
  livebetSource = interval(5000);

  clock: any;

  OpenBetForm!: FormGroup;
  openBet: any;
  stakeSetting = [];
  showLoader: boolean = false;
  eventsMap = {};
  cancelForm: FormGroup;

  cards = [
    { cardNo: 1, cardName: 'A' },
    { cardNo: 2, cardName: '2' },
    { cardNo: 3, cardName: '3' },
    { cardNo: 4, cardName: '4' },
    { cardNo: 5, cardName: '5' },
    { cardNo: 6, cardName: '6' },
    { cardNo: 7, cardName: '7' },
    { cardNo: 8, cardName: '8' },
    { cardNo: 9, cardName: '9' },
    { cardNo: 10, cardName: '10' },
    { cardNo: 11, cardName: 'J' },
    { cardNo: 12, cardName: 'Q' },
    { cardNo: 13, cardName: 'K' },
  ];
  seletedCards = [];
  isVoidBetModalOpen: boolean = false;

  isCancelBetModalOpen: boolean = false;
  isVoidAllBetModalOpen: boolean = false;
  isCancelAllBetModalOpen: boolean = false;
  type = 'PieChart';
  mydata = [
    ['Player', 45.0],
    ['Banker', 26.8],
    ['Tie', 12.8],

  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    is3D: true,
    backgroundColor: '#eee',
    slices: [{ color: 'rgb(8, 108, 184)' }, { color: 'rgb(131, 25, 36)' }, { color: 'rgb(39, 149, 50)' }],
    legend: {
      'position': 'right'
    },
    chartArea: {
      'left': '2%',
      'top': '2%',
      'bottom': '2%',
      'width': '100%',
      'height': '100%'
    },
  };
  width = 209;
  height = 160;
  p = 1;
  n = 100;
  orientation: number = 0;
  selectedVoidCancelBet = [];
  order: number = 2;
  orderByColumn: number = 3;
  voidForm: FormGroup;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    // console.log('orientationChanged');
    // console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
    this.orientation = event.target.screen.orientation.angle;
  }

  activatedTab = "hands";

  casinoSubscription: Subscription;
  liveBetSubscription: Subscription;

  selectedMarket = '0';
  selectedConsolidate = '0';
  minStake: number = 0;
  maxStake: number = 0;

  isShowMinMax: boolean = false;
  selectedEvent: string = '0';
  searchTerm: string;

  activeEvents: IEventFilter[];
  activeEventsHolder: IEventFilter[];
  selectedSport: string = '0';
  filtered;
  betIds = [];
  marketList;
  currentUser: any;
  showActions: boolean;
  sportFilterList = [
    { id: 1, name: 'Soccer' },
    { id: 2, name: 'Tennis' },
    { id: 41, name: 'Cricket' },
    { id: 52, name: 'Kabaddi' },
    { id: 4, name: 'Cricket Exchange' },
    { id: -2, name: 'Cricket Fancy' },
    { id: -1012, name: 'Virtual Cricket' },
    { id: 'teenpatti', name: 'Live Casino' },
    { id: 'x', name: 'X-Games' },
    { id: 74, name: 'Races' },
    { id: 7, name: 'Horse Racing' },
    { id: 4339, name: 'Greyhound Racing' },
    { id: -302, fillname: 'election', name: 'Election' },
  ];

  constructor(
    private route: ActivatedRoute,
    private casinoApi: CasinoApiService,
    private fb: FormBuilder,
    private shareUserService: ShareUserService,
    private common: CommonService,
    private loadingService: LoadingService,
    private betlistService: BetlistService,
    private authService: AuthService,
    private envService: EnvService,
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,

  ) {
    this.route.params.subscribe(params => {
      // console.log(params)
      this.tableName = params.tableName;
      this.tableId = params.tableId;
      this.gType = params.gType;
      $('#page_loading').css('display', 'block');

    })

  }

  ngOnInit(): void {
    this.common.apis$.subscribe((res) => {
      this.getCasinoRate();
      this.getLastResult();
      this.loadTableSettings();
      this.listLiveBets()
      this.getTpExpoCalls();
      this.casinoSubscription = this.casinoSource.subscribe((val) => {
        this.getCasinoRate();
      });
      this.liveBetSubscription = this.livebetSource.subscribe((val) => {
        this.listLiveBets();
      });
    });
    if (this.tableName == "DT2020") {
      this.activatedTab = "dragon";
    }


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
    this.voidForm = this.formBuilder.group({
      password: ['', Validators.required],
    });

    this.cancelForm = this.formBuilder.group({
      password: ['', Validators.required],
    });

  }
  confirmCancelVoidBet(bet: LiveBet, type: number) {
    this.selectedBet = bet;
    if (type === 1) {
      this.isVoidBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelBetModalOpen = true;
    }
  }

  closeCancelVoidModal() {
    this.isCancelBetModalOpen = false;
    this.isVoidBetModalOpen = false;
    this.selectedBet = null;
  }

  ngAfterViewInit() {
    this.setClock();
    if (this.tableName == "3CardsJud") {
      this.owlCarousel();
    }
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
    this.filterEvents();
    this.filterBets();
    this.orderOfDisplay();
    this.filterByTerm(this.searchTerm);
    // this.marketList="0"
  }

  setClock() {
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
  }
  owlCarousel() {
    // (<any>$("#andar_div,#bahar_div")).owlCarousel({
    //   loop: false,
    //   margin: 10,
    //   responsiveClass: false,
    //   slideBy: 5,
    //   dots: false,
    //   responsive: {
    //     0: {
    //       items: 5,
    //       nav: true,
    //     },
    //     600: {
    //       items: 5,
    //       nav: true,
    //     },
    //     1000: {
    //       items: 14,
    //       nav: true,
    //       loop: false,
    //     },
    //   },
    // });
  };




  listLiveBets() {
    // this.loadingService.setLoading(true);
    if (!this.isLoaded) {
      this.isLoaded = true;
      this.loadingService.setLoading(true);
    }
    if (!this.isInTransit) {
      this.isInTransit = true;
      this.betlistService
        .listLiveBets(this.tableId, this.p, this.n)
        .subscribe((res: GenericResponse<LiveBet[]>) => {
          this.isInTransit = false;
          if (res.errorCode === 0) {
            if (this.selectedVoidCancelBet.length == 0) {
              this.liveBetsListHolder = res.result;
              this.liveBetsListHolder = this.liveBetsListHolder.filter(
                (bet) => bet.eventName == this.tableName
              );

              this.liveBetsList = Object.assign([],
                this.datewisedescending(res.result)
              );
              console.log(this.liveBetsListHolder);



              res.result.forEach((bet) => {
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
    this.filterMarketByEvent(eventId);
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


  filterBets() {
    if (+this.selectedSport == 0) {
      this.liveBetsList = this.liveBetsListHolder;
    } else if (this.selectedSport === 'teenpatti') {
      this.liveBetsList = this.liveBetsListHolder?.filter((bet) => {
        return bet.sportName.toLowerCase().includes('live casino');
      });
      this.liveBetsList = this.liveBetsList.filter(
        (bet) => bet.sportName == 'live casino'
      );
      console.log(this.liveBetsList, 'live');
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

  filterEvents() {
    if (this.selectedSport === '0' || this.selectedSport === '') {
      this.activeEvents = this.activeEventsHolder;
    } else if (this.selectedSport === 'teenpatti') {
      this.activeEvents = this.activeEventsHolder.filter((event) => {
        return event.sportName.toLowerCase().includes('live casino');
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

  get f() {
    return this.OpenBetForm.controls;
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
  activeTab(tab) {
    this.activatedTab = tab;
  }


  showMinMax(sid) {

    this.isShowMinMax = !this.isShowMinMax;
    if (this.isShowMinMax) {
      $('#min-max-info_' + sid).fadeIn().css('display', 'block');
    } else {
      $('#min-max-info_' + sid).fadeOut().css('display', 'none');
    }
  }

  getCasinoRate() {

    this.casinoApi.casinoRate(this.gType).subscribe((resp: any) => {
      // console.log(resp)
      if (this.tableName != "TP1Day") {
        _.forEach(resp.data.t1, element => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        _.forEach(resp.data.t2, element => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        this.tpData = resp.data.t1[0];
        this.tpMarkets = resp.data.t2;
      } else {
        _.forEach(resp.data.bf, element => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        this.tpMarkets = resp.data.bf;
        this.tpData = {};
        this.tpData['mid'] = resp.data.bf[0].marketId;
        this.tpData['autotime'] = resp.data.bf[0].lasttime;
      }
      if (this.tableName == "TPOpen") {
        if (this.tpData.cards) {
          this.tpData.cards = this.tpData.cards.split(',');
          _.forEach(this.tpData.cards, (item, index) => {
            this.tpData.cards[index] = item.split('#')[0];
          })
        }
      }
      if (this.tableName == "32Cards" || this.tableName == "32CardsB") {
        if (this.tpData.desc) {
          this.tpData.desc = this.tpData.desc.split(',');
        }

        this.tpData['t1'] = [];
        this.tpData['t2'] = [];
        this.tpData['t3'] = [];
        this.tpData['t4'] = [];

        _.forEach(this.tpData.desc, (value: any, index: number) => {
          if (index == 0 || index == 4 || index == 8 || index == 12 || index == 16 || index == 20 || index == 24 || index == 28) {
            this.tpData.t1.push(value);
          }
          if (index == 1 || index == 5 || index == 9 || index == 13 || index == 17 || index == 21 || index == 25 || index == 29) {
            this.tpData.t2.push(value);
          }
          if (index == 2 || index == 6 || index == 10 || index == 14 || index == 18 || index == 22 || index == 26 || index == 30) {
            this.tpData.t3.push(value);
          }
          if (index == 3 || index == 7 || index == 11 || index == 15 || index == 119 || index == 23 || index == 27 || index == 31) {
            this.tpData.t4.push(value);
          }
        });

        // console.log(this.tpData)
      }

      if (this.tableName == "3CardsJud") {
        if (this.casinoPnl.length == 0) {
          setTimeout(() => {
            this.owlCarousel();
          }, 200)
        }
      }
      if (this.tableName == "CasinoMeter") {

        if (this.tpData.cards) {
          this.tpData.cards = this.tpData.cards.split(',');
        }
        this.tpData['high'] = [];
        this.tpData['low'] = [];
        _.forEach(this.tpData.cards, (item: any) => {
          if (item != 1) {
            let firstChr = item.substr(0, 1);
            if (item.length == 4) {
              firstChr = item.substr(0, 2);
            }
            if (firstChr == '10' || firstChr == 'J' || firstChr == 'Q' || firstChr == 'K') {
              this.tpData.high.push(item);
            } else {
              this.tpData.low.push(item);
            }
          }
        })
      }

      if (this.tableName == "Poker1Day") {
        this.tpFMarkets = resp.data.t3;
      }




      if (this.tpData.autotime) {
        if (this.clock) {
          this.clock.setValue(this.tpData.autotime);
        } else {
          this.setClock();
        }
      }

      if (this.tpData.mid.indexOf('.') > -1) {
        this.roundId = this.tpData.mid.split('.')[1];
      } else {
        this.roundId = this.tpData.mid;
      }

      if (this.oldRoundId != this.roundId) {
        this.casinoPnl = [];
        setTimeout(() => {
          if (this.oldRoundId != 0) {
            this.getLastResult();
          }
        }, 500)
        this.oldRoundId = this.roundId;
      }

      $('#page_loading').css('display', 'none');


    })
  }


  trackByIndex(index: number, item: any) {
    return item.sid;
  }

  getCardSymbolImg(cardName) {
    if (cardName == "1") {
      return "";
    }
    let char = "";
    let type = "";
    let className = "";
    let value = "";
    // let value = {};

    if (cardName.length == 4) {
      char = cardName.substring(0, 2);
      type = cardName.slice(2);
    } else {
      char = cardName.charAt(0);
      type = cardName.slice(1);
    }
    switch (type) {
      case "HH":
        type = "}";
        className = "card-black1";
        break;
      case "DD":
        type = "{";
        className = "card-red1";
        break;
      case "CC":
        type = "]";
        className = "card-black1";
        break;
      case "SS":
        type = "[";
        className = "card-red1";
        break;
    }

    value = char + '<span class="' + className + '">' + type + "</span>";

    return value;


    // return value = { type, className, char };
  };

  loadTableSettings() {
    this.casinoApi.loadTable(this.tableName).subscribe((resp: any) => {
      // console.log(resp)
      if (resp?.errorCode == 0) {
        this.minStake = resp.result[0].min;
        this.maxStake = resp.result[0].max.toString();
      }
    });
  }


  closeBoth() {
    this.isCancelBetModalOpen = false;
    this.isVoidBetModalOpen = false;
  }

  closeCancelVoidAllModal() {
    this.isCancelAllBetModalOpen = false;
    this.isVoidAllBetModalOpen = false;
    this.selectedVoidCancelBet = [];
    this.liveBetsList.forEach((event) => (event.activeStatus = false));
    this.uncheckAll();
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

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }

  getLastResult() {
    this.casinoApi.lastResult(this.gType).subscribe((resp: any) => {
      if (resp.data) {
        _.forEach(resp.data, (item) => {
          if (item.result == 0) {
            item['player'] = 'playerb';
            item['winner'] = 'R';
          }
          if (item.result == 1) {
            item['player'] = 'playera';
            item['winner'] = 'A';
          }
          if (item.result == 2) {
            item['player'] = 'playerb';
            item['winner'] = 'B';
          }
          if (item.result == 3) {
            item['player'] = 'playerb';
            item['winner'] = 'B';
          }
          if (this.tableName == "Lucky7A" || this.tableName == "Lucky7B") {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'L';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'H';
            }
            if (item.result == 0) {
              item['player'] = 'playerc';
              item['winner'] = 'T';
            }
          }
          if (this.tableName == "32Cards" || this.tableName == "32CardsB") {
            if (item.result == 1) {
              item['player'] = 'playerb';
              item['winner'] = '8';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = '9';
            }
            if (item.result == 3) {
              item['player'] = 'playerb';
              item['winner'] = '10';
            }
            if (item.result == 4) {
              item['player'] = 'playerb';
              item['winner'] = '11';
            }
          }
          if (this.tableName == "AAA" || this.tableName == "Bollywood") {
            if (item.result == 1) {
              item['player'] = 'playerb';
              item['winner'] = 'A';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'B';
            }
            if (item.result == 3) {
              item['player'] = 'playerb';
              item['winner'] = 'C';
            }
            if (item.result == 4) {
              item['player'] = 'playerb';
              item['winner'] = 'D';
            }
            if (item.result == 5) {
              item['player'] = 'playerb';
              item['winner'] = 'E';
            }

            if (item.result == 6) {
              item['player'] = 'playerb';
              item['winner'] = 'F';
            }
          }
          if (this.tableName == "Baccarat") {
            if (item.result == 1) {
              item['player'] = 'cplayer';
              item['winner'] = 'P';
            }
            if (item.result == 2) {
              item['player'] = 'cbanker';
              item['winner'] = 'B';
            }
            if (item.result == 3) {
              item['player'] = 'ctie';
              item['winner'] = 'T';
            }
            if (resp.graphdata) {
              this.mydata = [];
              this.mydata.push(['Player', resp.graphdata.P]);
              this.mydata.push(['Banker', resp.graphdata.B]);
              this.mydata.push(['Tie', resp.graphdata.T]);
            }
          }
          if (this.tableName == "Poker2020" || this.tableName == "Poker1Day") {
            if (item.result == 0) {
              item['player'] = 'playert';
              item['winner'] = 'T';
            }
            if (item.result == 11) {
              item['player'] = 'playera';
              item['winner'] = 'A';
            }
            if (item.result == 21) {
              item['player'] = 'playerb';
              item['winner'] = 'B';
            }
          }
          if (this.tableName == "Poker6P") {
            if (item.result == 0) {
              item['player'] = 'playert';
              item['winner'] = 'T';
            }
            if (item.result == 11) {
              item['player'] = 'playera';
              item['winner'] = '1';
            }
            if (item.result == 12) {
              item['player'] = 'playera';
              item['winner'] = '2';
            }
            if (item.result == 13) {
              item['player'] = 'playera';
              item['winner'] = '3';
            }
            if (item.result == 14) {
              item['player'] = 'playera';
              item['winner'] = '4';
            }
            if (item.result == 15) {
              item['player'] = 'playera';
              item['winner'] = '5';
            }
            if (item.result == 16) {
              item['player'] = 'playera';
              item['winner'] = '6';
            }
          }
          if (this.tableName == "DT2020" || this.tableName == "DT1Day") {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'D';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'T';
            }
          }
          if (this.tableName == "DTL2020") {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'D';
            }
            if (item.result == 21) {
              item['player'] = 'playerb';
              item['winner'] = 'T';
            }
            if (item.result == 41) {
              item['player'] = 'playerc';
              item['winner'] = 'L';
            }
          }
        })
      }
      this.lastResults = resp.data;
    })
  }

  getRoundResult(gameRound) {
    console.log(gameRound)

    this.casinoApi.roundResult(this.gType, gameRound.mid).subscribe((resp: any) => {
      if (resp.data) {
        this.roundResult = resp.data[0];
        this.roundResult.cards = this.roundResult.cards.split(',');
        this.roundResult.mid = this.roundResult.mid.split('.')[1];

        if (this.tableName == "32Cards" || this.tableName == "32CardsB") {

          this.roundResult['t1'] = [];
          this.roundResult['t2'] = [];
          this.roundResult['t3'] = [];
          this.roundResult['t4'] = [];

          _.forEach(this.roundResult.cards, (value: any, index: number) => {
            if (index == 0 || index == 4 || index == 8 || index == 12 || index == 16 || index == 20 || index == 24 || index == 28) {
              this.roundResult.t1.push(value);
            }
            if (index == 1 || index == 5 || index == 9 || index == 13 || index == 17 || index == 21 || index == 25 || index == 29) {
              this.roundResult.t2.push(value);
            }
            if (index == 2 || index == 6 || index == 10 || index == 14 || index == 18 || index == 22 || index == 26 || index == 30) {
              this.roundResult.t3.push(value);
            }
            if (index == 3 || index == 7 || index == 11 || index == 15 || index == 119 || index == 23 || index == 27 || index == 31) {
              this.roundResult.t4.push(value);
            }
          });
        }

        if (this.tableName == "CasinoMeter") {

          this.roundResult['high'] = [];
          this.roundResult['low'] = [];
          this.roundResult['hlwin'] = [];

          _.forEach(this.roundResult.cards, (item: any) => {
            if (item != 1) {
              if (item == "10HH" || item == "9HH") {
                this.roundResult.hlwin.push(item);
                return;
              }
              let firstChr = item.substr(0, 1);
              if (item.length == 4) {
                firstChr = item.substr(0, 2);
              }
              if (firstChr == '10' || firstChr == 'J' || firstChr == 'Q' || firstChr == 'K') {
                this.roundResult.high.push(item);
              } else {
                this.roundResult.low.push(item);
              }
            }
          })
        }


        console.log(this.roundResult);

        $('#casinoResultWrap').fadeIn();

      }
    });

  }

  openCasinoRules() {
    $('#casinoRulesWrap').fadeIn();
  }

  closeCasinoResult() {
    $('#casinoResultWrap').fadeOut();
  }

  closeCasinoRules() {
    $('#casinoRulesWrap').fadeOut();
  }

  getTpExpoCalls() {
    this.shareUserService.callTpExpo$.subscribe((data) => {
      if (data) {
        this.openBet = data;
      } else {
        this.openBet = data;
      }
    })
  }









  selected3cardj(card: any, betType: any): any {
    let selected = false;
    if (!this.openBet) {
      return selected;
    }

    if (this.openBet.backlay == betType) {
      let indexcheck = this.seletedCards.indexOf(card);
      if (indexcheck > -1) {
        return selected = true;
      }
    }
  };

  trackById(index, item: LiveBet) {
    return item.consolidateId;
  }

  ClearAllSelection() {
    this.openBet = null;
    this.seletedCards = [];
    this.shareUserService.shareBetSlipData(this.openBet);
  }

  ngOnDestroy(): void {
    if (this.casinoSubscription) {
      this.casinoSubscription.unsubscribe();
    }
    if (this.liveBetSubscription) {
      this.liveBetSubscription.unsubscribe();
    }
  }


}
