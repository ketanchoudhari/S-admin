import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { BetlistService } from 'src/app/betlist/betlist.service';
import { IBetHistory } from 'src/app/betlist/types/bet-history';
import { LiveBet } from 'src/app/betlist/types/live-bet';
import { EnvService } from 'src/app/env.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { AnalysisService } from '../analysis.service';
import { IBook } from '../types/book';
import * as _ from 'lodash';

import { DomSanitizer } from '@angular/platform-browser';
import { FullmarketService } from 'src/app/services/fullmarket.service';
import { map } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reportbet',
  templateUrl: './reportbet.component.html',
  styleUrls: ['./reportbet.component.scss'],
})

export class ReportbetComponent implements OnInit, OnDestroy {
  siteName = environment.siteName;
  fromDate;
  toDate;
  loadingCounter:number=0;
  interval;
  dateConfig: IDayTimeCalendarConfig;
  oldOddsInplaydata = [];
  isBookModalOpen = false;
  isRejectBetModalOpen = false;

  eventId: string;
  analysisData?: IBook;
  eventName: string;
  bmFancyData: any;
  betlistCount:number;
  selectedBook: { [key: number]: number } = {};

  isVoidBetModalOpen: boolean = false;
  isCancelBetModalOpen: boolean = false;

  selectedBet: IBetHistory = null;
  bookData;
  liveBetsList: LiveBet[];

  p: number = 1;
  page1: number = 1;
  tdWidth = 0;
  selectedFancyExpBook = [];
  liveFancyBetsList: LiveBet[];

  currentUser: CurrentUser;
  showActions: boolean;
  heirarchyMap = {
    2: 'WL ID',
    3: 'AD ID',
    4: 'SA ID',
    5: 'SM ID',
    6: 'MA ID',
    7: 'AG ID',
  };
  isBdlevel=environment.isBdlevel;
  // nextCall$ = new Subject();
  listBooksCalls: boolean = true;
  bmFancyCalls: boolean = true;
  timerSubscription: Subscription;
  listLiveBetsCalls: boolean = true;
  tvUrl: any;
  scoreUrl: string;
  fullScorev: any;
  fullScore: any;
  isScore: boolean;
  score_id: any;
  virtual: boolean = false;
  sportName: string;
  sportId: number;
  matchid: any;
  data: any;
  matchdate: string;
  currentDate: Date;

  selectedTabIndex: number = 0;
  showActionsvoid: boolean;
  selectTab(num) {
    this.selectedTabIndex = num;
  }
  voidForm: FormGroup;

  // private sanitizer: DomSanitizer;
  n = 100;
  constructor(
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute,
    private analysisService: AnalysisService,
    private betlistService: BetlistService,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private authService: AuthService,
    private envService: EnvService,
    private sanitizer: DomSanitizer,
    private fullmarketService: FullmarketService,
    private formBuilder: FormBuilder,
  ) {
    this.dateConfig = {
      format: 'YYYY-MM-DD',
    };
    this.currentDate = new Date();
    //  console.log(this.currentDate.getDate(), 'current date');

    this.matchdate =
      this.currentDate.getUTCFullYear() +
      '-' +
      this.currentDate.getUTCMonth() +
      '-' +
      this.currentDate.getUTCDate() +
      'T' +
      this.currentDate.getUTCHours() +
      ':' +
      this.currentDate.getUTCMinutes() +
      ':' +
      this.currentDate.getUTCSeconds();

    //  console.log(this.matchdate, 'matchdate');
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
    this.tvUrl = '';

    this.activatedRoute.params.subscribe((params) => {
      this.eventId = params.eventId;
      this.commonService.apis$.subscribe(res => {
        this.timerSubscription = timer(500, 10000).pipe(
          map(() => {
            this.listBooks();
            this.listLiveBets();
            // this.getTvUrl();
          })
        ).subscribe();
        this.interval = setInterval(() => {
          this.oddsInplayApi();
          this.getBmFancy();
        }, 1500);
        this.getTvUrl();
      })
    });


    this.currentUser = this.authService.currentUser;
    this.commonService.hierarchyMap$;
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });

    let showActions = this.envService.environment.showVoidCancel;
    let showActionsvoid =  this.envService.environment.showVoidCancel;
    this.commonService.hierarchyMap$.subscribe((map) => {
      // this.hierarchyMap = map;
      if (
        this.currentUser?.userType === this.commonService.whitelabelUserType ||
        this.currentUser?.userType === this.commonService.vrnlUserType ||
        (this.currentUser?.userType == this.commonService.adminUserType &&
          showActions)
      ) {
        this.showActions = true;
      } else {
        this.showActions = false;
      }
      // console.log(this.currentUser.userType, this.showActions);
    });
    this.commonService.hierarchyMap$.subscribe((map) => {
      // this.hierarchyMap = map;
      if (
        this.currentUser?.userType === this.commonService.whitelabelUserType ||
        this.currentUser?.userType === this.commonService.vrnlUserType && showActionsvoid
      ) {
        this.showActionsvoid = true;
      } else {
        this.showActionsvoid = false;
      }
    });
    this.voidForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  getScoreData() {
    this.sportName = this.analysisData?.exchangeBooks[0]?.sportName;
    // console.log();
    if (this.sportName == 'tennis') {
      this.sportId = 2;
    } else if (this.sportName == 'cricket' || this.sportName == 'Virtual Cricket') this.sportId = 4;
    else if (this.sportName == 'soccer') this.sportId = 1;

    //  console.log('this.sportId', this.sportId);
    if (!this.matchid) this.live_score_api();
  }

  listLiveBets() {
    if (!this.listLiveBetsCalls) {
      return;
    }
    
    if(this.loadingCounter == 0){
      this.loadingService.setLoading(true);
    }
    this.loadingCounter++;
    this.listLiveBetsCalls = false;
    this.betlistService
      .listLiveBets(this.eventId,this.p, this.n)
      .subscribe((res: GenericResponse<LiveBet[]>) => {
        if (res && res.errorCode === 0) {
          let Logcount = res.result[0];
          this.betlistCount = Logcount.count;
          var livebets = this.datewisedescending(res.result.slice(1));
          this.liveBetsList = res.result.slice(1).filter((bet) => {
            return +bet.sportId !== -2;
          });
          this.liveFancyBetsList = res.result.slice(1).filter(
            (bet) => +bet.sportId === -2
          );
        }
        this.listLiveBetsCalls = true;
      });
  }
  selectNoRows(numberOfRows: number) {
    // this.liveBetsList.forEach((bet) => (bet.activeStatus = false));
    this.p = 1;
    this.n = +numberOfRows;
    this.listLiveBets();
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

  openBookModal(totalPL: any) {
    this.selectedFancyExpBook = this.generateBook(totalPL);
    setTimeout(() => {
      this.isBookModalOpen = true;
    }, 100);
  }

  openRejectBetModal() {
    this.isRejectBetModalOpen = true;
  }

  listBooks() {
    if (!this.listBooksCalls) {
      return;
    }
    if (!this.eventId) {
      // console.log(this.eventId);
      return;
    }
    this.listBooksCalls = false;
    this.analysisService
      .listBooks(this.eventId)
      .subscribe((res: GenericResponse<IBook[]>) => {
        //  console.log(res, 'listbook response');
        this.loadingService.setLoading(false);
        if (res?.errorCode == 0 && res?.result.length) {
          if(typeof res.result[0] == 'string'){
            // setTimeout(() => {
            //   this.listBooks();
            // },2500);
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe();
            }
            this.timerSubscription = timer(500, 10000).pipe(
              map(() => {
                this.listBooks();
              })
            ).subscribe();
          }
          if (
            res.result &&
            typeof res.result[0] != 'string' &&
            'exchangeBooks' in res.result[0]
          ) {

            if (this.bmFancyData) {
              if (res.result[0].fancyBook && this.bmFancyData.Fancymarket) {
                res.result[0].fancyBook.forEach(element => {
                  this.bmFancyData.Fancymarket.forEach(element2 => {
                    if (element.marketName == element2.nat) {
                      element.yesRuns = element2.b1;
                      element.yesOdd = element2.bs1;
                      element.noRuns = element2.l1;
                      element.noOdd = element2.ls1;
                    }
                  });
                });
              }
              if (res.result[0].exchangeBooks && this.bmFancyData.BMmarket) {
                res.result[0].exchangeBooks.forEach(element => {
                  if (element.marketName == "Bookmaker") {
                    this.bmFancyData.BMmarket.bm1.forEach(element2 => {
                      element.selections.forEach(element3 => {
                        if (element3.selName == element2.nat) {
                          element3.backOdd1 = element2.b1;
                          element3.layOdd1 = element2.l1;
                        }
                      })
                    });
                  }
                });
              }
            }
            if (res.result[0]) {
              let resultMarkets = _.cloneDeep(res.result[0]?.exchangeBooks);
              res.result[0]?.exchangeBooks.forEach((element,ind) => {
                if(element.marketName==="Tied Match"){
                    res.result[0]?.exchangeBooks.splice(ind,1);
                    res.result[0]?.exchangeBooks.push(resultMarkets.find(x => x.marketName == "Tied Match"))
                }
                if(element.marketName === "To Win the Toss"){
                  res.result[0]?.exchangeBooks.splice(ind,1);
                }
                let selectionsclonedMO = _.cloneDeep(element.selections);
                  element.selections.forEach((runner,index) => {
                    if(runner.selName==="The Draw"){
                        element.selections.splice(index,1);
                        element.selections.push(selectionsclonedMO.find(x => x.selName == "The Draw"))
                    }
                  });
                
              });
              
              res.result[0]?.exchangeBooks.forEach((element1) => {
                if(element1.marketName === "Bookmaker"){
                let selectionsclonedBM = _.cloneDeep(element1.selections);
                  element1.selections.forEach((runner,index) => {
                    if(runner.selName == "The Draw"){
                      element1.selections.splice(index,1);
                      element1.selections.push(selectionsclonedBM.find(x => x.selName == "The Draw"))
                    }
                  });
                }
              });
            }
            if (res.result[0]) {
              let selectionsclonedMarkets = _.cloneDeep(res.result[0]?.exchangeBooks);
              //FOR SORTING MARKETS FROM EXISTING ARRAY
              res.result[0]?.exchangeBooks.forEach((element,ind) => {
                if(element.marketName === "To Win the Toss" || element.marketName === "Bookmaker"){
                  res.result[0]?.exchangeBooks.splice(ind,1);
                  res.result[0]?.exchangeBooks.push(selectionsclonedMarkets.find(x => x.marketName == "Bookmaker"))
                }
              });

              res.result[0]?.exchangeBooks.forEach((element,ind) => {
                if(element.marketName === "To Win the Toss"){
                  res.result[0]?.exchangeBooks.splice(ind,1);
                }
                if(element.marketName === "Match Odds"){
                let selectionsclonedMO = _.cloneDeep(element.selections);
                  element.selections.forEach((runner,index) => {
                    if(runner.selName==="The Draw"){
                        element.selections.splice(index,1);
                        element.selections.push(selectionsclonedMO.find(x => x.selName == "The Draw"))
                    }
                  });
                } 
              });
              
              res.result[0]?.exchangeBooks.forEach((element1) => {
                if(element1.marketName === "Bookmaker"){
                let selectionsclonedBM = _.cloneDeep(element1.selections);
                  element1.selections.forEach((runner,index) => {
                    if(runner.selName == "The Draw"){
                      element1.selections.splice(index,1);
                      element1.selections.push(selectionsclonedBM.find(x => x.selName == "The Draw"))
                    }
                  });
                }
              });
            }
            if (res.result[0]) {
              res.result[0].exchangeBooks.forEach(market => {

                market.users.forEach(user1 => {
                  let cloneSelection1 = _.cloneDeep(user1.selections);
                  cloneSelection1.forEach((selection1, index1) => {
                    market.selections.forEach((selection, index) => {
                      if (selection1.selName == selection.selName) {
                        user1.selections[index] = selection1;
                      }
                    })
                  })
                  user1.users.forEach(user2 => {
                    let cloneSelection2 = _.cloneDeep(user2.selections);
                    cloneSelection2.forEach((selection2, index1) => {
                      market.selections.forEach((selection, index) => {
                        if (selection2.selName == selection.selName) {
                          user2.selections[index] = selection2;
                        }
                      })
                    })
                    user2.users.forEach(user3 => {
                      let cloneSelection3 = _.cloneDeep(user3.selections);
                      cloneSelection3.forEach((selection3, index1) => {
                        market.selections.forEach((selection, index) => {
                          if (selection3.selName == selection.selName) {
                            user3.selections[index] = selection3;
                          }
                        })
                      })
                      user3.users.forEach(user4 => {
                        let cloneSelection4 = _.cloneDeep(user4.selections);
                        cloneSelection4.forEach((selection4, index1) => {
                          market.selections.forEach((selection, index) => {
                            if (selection4.selName == selection.selName) {
                              user4.selections[index] = selection4;
                            }
                          })
                        })
                        user4.users.forEach(user5 => {
                          let cloneSelection5 = _.cloneDeep(user5.selections);
                          cloneSelection5.forEach((selection5, index1) => {
                            market.selections.forEach((selection, index) => {
                              if (selection5.selName == selection.selName) {
                                user5.selections[index] = selection5;
                              }
                            })
                          })
                          user5.users.forEach(user6 => {
                            let cloneSelection6 = _.cloneDeep(user6.selections);
                            cloneSelection6.forEach((selection6, index1) => {
                              market.selections.forEach((selection, index) => {
                                if (selection6.selName == selection.selName) {
                                  user6.selections[index] = selection6;
                                }
                              })
                            })
                            user6.users.forEach(user7 => {
                              let cloneSelection7 = _.cloneDeep(user7.selections);
                              cloneSelection7.forEach((selection7, index1) => {
                                market.selections.forEach((selection, index) => {
                                  if (selection7.selName == selection.selName) {
                                    user7.selections[index] = selection7;
                                  }
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            }

            this.analysisData = res.result[0];
            // console.log(this.analysisData, 'Analysis data');
            this.bookData = this.analysisData?.exchangeBooks;
            if (this.sportId == undefined || !this.sportId) this.getScoreData();
          }
        }
        this.listBooksCalls = true;
      });
  }

  getBmFancy() {

    if (this.sportName != 'cricket') {
      return;
    }
    if (!this.bmFancyCalls) {
      return;
    }
    this.bmFancyCalls = false;
    this.analysisService
      .getBmFancy(this.eventId)
      .subscribe((res: any) => {
        // console.log(res, 'bm_fancy response');
        if (res) {
          this.bmFancyData = res;
          if (this.analysisData) {
            if (this.analysisData.fancyBook && res.Fancymarket) {
              this.analysisData.fancyBook.forEach(element => {
                res.Fancymarket.forEach(element2 => {
                  if (element.marketName == element2.nat) {
                    element.yesRuns = element2.b1;
                    element.yesOdd = element2.bs1;
                    element.noRuns = element2.l1;
                    element.noOdd = element2.ls1;

                  }

                });
              });
            }
            if (this.analysisData.exchangeBooks && res.BMmarket) {
              this.analysisData.exchangeBooks.forEach(element => {
                if (element.marketName == "Bookmaker") {
                  res.BMmarket.bm1.forEach(element2 => {
                    element.selections.forEach(element3 => {
                      if (element3.selName == element2.nat) {
                        element3.backOdd1 = element2.b1;
                        element3.layOdd1 = element2.l1;
                      }
                    })
                  });
                }
              });
            }
          }
        }
        this.bmFancyCalls = true;
      });
  }

  oddsInplayApi() {

    let allBFmarkets = [];
    var filteredBfMktIds = this.bookData?.filter(p => String(p.marketId).startsWith('1.'));
    filteredBfMktIds.forEach(mkt => {
      allBFmarkets.push(mkt.marketId)
    })
    if (filteredBfMktIds.length == 0) {
      this.oldOddsInplaydata = [];
      return;
    }
    this.analysisService
      .oddsInplay(allBFmarkets.toString())
      .subscribe((res: any) => {
        // console.log(res);

        if (this.oldOddsInplaydata.length == 0) {
          this.oldOddsInplaydata = res;
        }
        res.forEach((oddsmkts, index) => {
          filteredBfMktIds.forEach(mkts => {
            if (oddsmkts.MarketId == mkts.marketId) {
              mkts.selections.forEach((selection: any) => {
                oddsmkts.Runners.forEach((selection1: any, index2) => {
                  if (selection.selectionId == selection1.SelectionId) {
                    var txtmarketid = oddsmkts?.MarketId.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '_');
                    // console.log(selection.selName, selection1.runnerName);
                    $("#back_1_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToBack[0]?.price);
                    $("#back_1_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToBack[0]?.size);
                    $("#back_2_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToBack[1]?.price);
                    $("#back_2_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToBack[1]?.size);
                    $("#back_3_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToBack[2]?.price);
                    $("#back_3_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToBack[2]?.size);
                    $("#lay_1_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToLay[0]?.price);
                    $("#lay_1_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToLay[0]?.size);
                    $("#lay_2_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToLay[1]?.price);
                    $("#lay_2_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToLay[1]?.size);
                    $("#lay_3_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToLay[2]?.price);
                    $("#lay_3_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToLay[2]?.size);

                    if ((this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToBack[0].price != selection1.ExchangePrices.AvailableToBack[0].price) ||
                      (this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToBack[0].size != selection1.ExchangePrices.AvailableToBack[0].size)) {
                      $("#back_1_" + txtmarketid + "_" + selection.selectionId + ".back-1").addClass("spark");
                      $("#back_1_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToBack[0]?.price);
                      $("#back_1_" + txtmarketid + "_" + selection.selectionId + "a span").text(selection1?.ExchangePrices?.AvailableToBack[0]?.size);
                      const back1 = $("#back_1_" + txtmarketid + "_" + selection.selectionId + ".back-1");
                      this.removeChangeClass(back1);
                    }
                    if ((this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToBack[1].price != selection1.ExchangePrices.AvailableToBack[1].price) ||
                      (this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToBack[1].size != selection1.ExchangePrices.AvailableToBack[1].size)) {
                      $("#back_2_" + txtmarketid + "_" + selection.selectionId + ".back-2").addClass("spark");
                      $("#back_2_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToBack[1]?.price);
                      $("#back_2_" + txtmarketid + "_" + selection.selectionId + " a span").text(selection1?.ExchangePrices?.AvailableToBack[1]?.size);
                      const back2 = $("#back_2_" + txtmarketid + "_" + selection.selectionId + ".back-2");
                      this.removeChangeClass(back2);
                    }
                    if ((this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToBack[2].price != selection1.ExchangePrices.AvailableToBack[2].price) ||
                      (this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToBack[2].size != selection1.ExchangePrices.AvailableToBack[2].size)) {
                      $("#back_3_" + txtmarketid + "_" + selection.selectionId + ".back-3").addClass("spark");
                      $("#back_3_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToBack[2]?.price);
                      $("#back_3_" + txtmarketid + "_" + selection.selectionId + " a span").text(selection1?.ExchangePrices?.AvailableToBack[2]?.size);
                      const back3 = $("#back_3_" + txtmarketid + "_" + selection.selectionId + ".back-3");
                      this.removeChangeClass(back3);
                    }

                    if ((this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToLay[0].price != selection1.ExchangePrices.AvailableToLay[0].price) ||
                      (this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToLay[0].size != selection1.ExchangePrices.AvailableToLay[0].size)) {
                      $("#lay_1_" + txtmarketid + "_" + selection.selectionId + ".lay-1").addClass("spark");
                      $("#lay_1_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToLay[0]?.price);
                      $("#lay_1_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToLay[0]?.size);
                      const lay1 = $("#lay_1_" + txtmarketid + "_" + selection.selectionId + ".lay-1");
                      this.removeChangeClass(lay1);
                    }
                    if ((this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToLay[1].price != selection1.ExchangePrices.AvailableToLay[1].price) ||
                      (this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToLay[1].size != selection1.ExchangePrices.AvailableToLay[1].size)) {
                      $("#lay_2_" + txtmarketid + "_" + selection.selectionId + ".lay-2").addClass("spark");
                      $("#lay_2_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToLay[1]?.price);
                      $("#lay_2_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToLay[1]?.size);
                      const lay2 = $("#lay_2_" + txtmarketid + "_" + selection.selectionId + ".lay-2");
                      this.removeChangeClass(lay2);
                    }
                    if ((this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToLay[2].price != selection1.ExchangePrices.AvailableToLay[2].price) ||
                      (this.oldOddsInplaydata[index].Runners[index2].ExchangePrices.AvailableToLay[2].size != selection1.ExchangePrices.AvailableToLay[2].size)) {
                      $("#lay_3_" + txtmarketid + "_" + selection.selectionId + ".lay-3").addClass("spark");
                      $("#lay_3_" + txtmarketid + "_" + selection.selectionId + " b").text(selection1?.ExchangePrices?.AvailableToLay[2]?.price);
                      $("#lay_3_" + txtmarketid + "_" + selection.selectionId + " span").text(selection1?.ExchangePrices?.AvailableToLay[2]?.size);
                      const lay3 = $("#lay_3_" + txtmarketid + "_" + selection.selectionId + ".lay-3");
                      this.removeChangeClass(lay3);
                    }
                  }
                })
              })
            }
          })
        })
        this.oldOddsInplaydata = res;
      })
  }

  removeChangeClass(changeClass) {
    setTimeout(() => {
      changeClass.removeClass("spark");
    }, 300);
  }

  removeSpacefilter(value) {
    if (value) {
      value = value.toString();
      return value.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '_');
    }
  }

  generateBook(totalPL) {
    let exposureBook = [];
    let matrix = [];
    let i = 0;
    Object.entries(totalPL).forEach(([run, exp]) => {
      matrix[i++] = [[+run], [exp]];
    });
    for (let i = 0; i < matrix.length; i++) {
      let run = matrix[i][0];
      let row = [];
      if (i === 0) {
        row[0] = run + ' and below';
      } else if (i === matrix.length - 1) {
        row[0] = `${+matrix[i - 1][0] + 1} and above`;
      } else if (+matrix[i - 1][0] + 1 === +matrix[i][0]) {
        row[0] = matrix[i][0];
      } else {
        row[0] = `${+matrix[i - 1][0] + 1}-${matrix[i][0]}`;
      }
      row[1] = matrix[i][1];
      exposureBook.push(row);
    }
    return exposureBook;
  }



  showTv: boolean = false;
  toggleTv() {
    this.showTv = !this.showTv;
  }

  opened: boolean = false;
  hidden: boolean = false;
  toggleFunds() {
    if (this.opened) {
      this.hidden = true;
      setTimeout(() => {
        this.hidden = false;
      }, 150);
    }
    this.opened = !this.opened;
  }

  getTvUrl() {
    this.tvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://streamingtv.fun/live_tv/index.html?eventId=${this.eventId}`
    );
    //  console.log('tv url', this.tvUrl);
  }

  live_score_api() {
    this.matchid = this.eventId;

    this.fullmarketService.GetScoreId(this.matchid).subscribe((resp: any) => {
      this.data = resp.result;
      // console.log('repsonse of live_score_api', this.data);
      this.score_id = resp.result[0]?.score_id;
      //  console.log('score', this.data);

      if (this.sportId == 4 && this.score_id) {
        this.GettcricketScoreId();
      } else if (this.sportId == 2 && this.score_id) {
        this.GettennisScoreId();
      } else if (this.sportId == 1 && this.score_id) {
        this.GetsocccerScoreId();
      }
    });
  }

  sportradarcricket_url: any;
  sportradarcricket_urll: any;
  sportradartennis_url: any;
  sportradartennis_urll: any;
  sportradarsoccer_url: any;
  sportradarsoccer_urll: any;

  scoreurl: any;
  GettcricketScoreId() {
    let url =`https://www.satsports.net/score_widget/index.html?id=${this.score_id}&aC=bGFzZXJib29rMjQ3`
      this.matchdate;
    this.sportradarcricket_url = url;

    this.sportradarcricket_urll = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sportradarcricket_url
    );
    // console.log(this.sportradarcricket_urll);
  }
  GettennisScoreId() {
    let url =`https://www.satsports.net/score_widget/index.html?id=${this.score_id}&aC=bGFzZXJib29rMjQ3`
    this.sportradartennis_url = url;
    this.sportradartennis_urll = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sportradartennis_url
    );
    // console.log(this.sportradartennis_urll);
  }

  GetsocccerScoreId() {
    let url =`https://www.satsports.net/score_widget/index.html?id=${this.score_id}&aC=bGFzZXJib29rMjQ3`
    this.sportradarsoccer_url = url;
    this.sportradarsoccer_urll = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sportradarsoccer_url
    );
    // console.log(this.sportradarsoccer_urll);
  }

  getScore() {
    this.matchid = this.eventId;
    if (this.matchid != undefined && !this.score_id) {
      this.fullmarketService.getScore(this.matchid).subscribe((res: any) => {
        if (res) {
          if (this.sportId == 1) {
            this.fullScore = res;
          } else if (this.sportId == 2) {
            this.fullScore = res;
          } else if (this.sportId == 4) {
            if ('currentDay' in res) {
              this.fullScore = res;
              this.fullScore.cricketScore2 = true;
            } else {
              this.fullScore = res.score;
              // this.fullScore.cricketScore2 = false;
            }
            // this.matcheventId = res.eventId;
          }
          // if (this.isVirtual == true) {
          // this.fullScorev = JSON.stringify(res.score);
          // this.fullScorevirtual = JSON.parse(res.score);
          // this.fullScorevirtual= res.score;

          // console.log(this.fullScorevirtual)
        }
      });
    }
  }

  toggleExpand(event, id: any, length?: number) {
    // console.log(event, id, length);
    
    if (length) {
      for (let i = 0; i < 1; i++) {
        let state = document.getElementById(`${id}`)?.style.display;
        // console.log(`${id}`,state);
        
        if (state === 'none') {
          let el = document.getElementById(`${id}`);
          if (el) {
            document.getElementById(`${id}`).style.display = 'table-row';
            event.target.className = 'expand-open';
          }
        } else {
          let el = document.getElementById(`${id}`);
          
          if (el) {
            document.getElementById(`${id}`).style.display = 'none';
            event.target.className = 'expand-close';
          }
        }
      }
    } else {
      let state = document.getElementById(id)?.style.display;
      if (state === 'none') {
        document.getElementById(id).style.display = 'table-row';
        event.target.className = 'expand-open';
      } else {
        document.getElementById(id).style.display = 'none';
        event.target.className = 'expand-close';
      }
    }
  }

  trackByFn(item, index) {
    return item;
  }

  confirmCancelVoidBet(bet: IBetHistory, type: number) {
    this.selectedBet = bet;
    if (type === 1) {
      this.isVoidBetModalOpen = true;
    } else if (type === 2) {
      this.isCancelBetModalOpen = true;
    }
  }

  cancelVoidBet(type: number) {
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
              this.closeCancelVoidModal();
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
  }

  closeCancelVoidModal() {
    this.isCancelBetModalOpen = false;
    this.isVoidBetModalOpen = false;
    this.selectedBet = null;
  }

  trackByIndex(index) {
    return index;
  }

  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }

  scoreTv: boolean = true;
  displayScore() {
    this.scoreTv = !this.scoreTv;
  }


  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
