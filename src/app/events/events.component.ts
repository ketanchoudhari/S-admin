import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDatePickerConfig } from 'ng2-date-picker';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ShareDataService } from '../services/share-data.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { IUserList } from '../users/models/user-list';
import { UsersService } from '../users/users.service';
import { EventsService } from './events.service';
import { IEvent } from './types/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  timeFormat = environment.timeFormat;
  siteName = environment.siteName;
  selectedTabIndex: number = 2;
  isSportModalOpen: boolean = false;
  isTourModalOpen: boolean = false;
  isMatchModalOpen: boolean = false;
  isBetModalOpen: boolean = false;
  isSuspendInTransit: boolean = false;
  fromDate: Date;
  dateConfig: IDatePickerConfig;
  eventsLists: IEvent[];
  activeGames: IEvent[];

  eventsListsHolder: IEvent[] = [];
  activeGamesHolder: IEvent[] = [];
  gameId: any;

  importingGames: boolean = false;
  deactivatingGames: boolean = false;
  activeGameIds: number[] = [];

  selectedSport: number = 0;
  selectAll = false;

  searchTerm$ = new Subject<string>();
  searchTerm: string;
  totalOnlineUser: number = 0;
  deactiveGameIds: number[] = [];
  showActivateFancy: boolean = false;
  showActions: boolean = false;
  currentUser: CurrentUser;

  activateFancyIds = [];

  subSink = new Subscription();
  isListGamesInTransit: boolean;
  isActiveGamesInTransit: boolean;
  isVirtualInTransit: boolean;
  usersList = [];
  usersListfilter: any[];
  userid: any = 0;
  fullHirarchySub: Subscription;
  totalUser: number = 0;
  totalAdmin: number = 0;
  totalPlayer: number = 0;
  adminList = [];
  playerList = [];
  userType: number;
  userMultiplier = 0;
  month;
  Update: any;
  constructor(
    private eventsService: EventsService,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private authService: AuthService,
    private commonService: CommonService,
    private usersService: UsersService,
    private shareService: ShareDataService
  ) {
    // this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd');
    this.dateConfig = {
      format: 'YYYY-MM-DD',
    };
  }

  ngOnInit(): void {
    this.getlanguages();
    this.commonService.apis$.subscribe((res) => {
      // this.getGameList();
      this.getActivateGame();
      this.listUser();
    });

    this.searchTerm$
      .pipe(
        // filter((v) => v.length > 0),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.search(value);
      });

    this.currentUser = this.authService.currentUser;
    this.userType = this.currentUser.userType;
    this.userMultiplier = environment.userMultiplier;
    this.commonService.hierarchyMap$.subscribe(() => {
      if (this.currentUser.userType === this.commonService.vrnlUserType) {
        this.showActivateFancy = true;
      } else {
        this.showActivateFancy = false;
      }

      if (this.currentUser.userType === this.commonService.vrnlUserType || this.currentUser.userType === this.commonService.whitelabelUserType || (this.currentUser.userType === this.commonService.adminUserType && this.siteName == 'skybet365')) {
        this.showActions = true;
      }
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
  getGameList() {
    // this.eventsLists = [];
    if (!this.isListGamesInTransit) {
      this.isListGamesInTransit = true;
      this.loadingService.setLoading(true);
      let listGameSub = this.eventsService
        .listGame()
        .pipe(finalize(() => (this.isListGamesInTransit = false)))
        .subscribe((res: GenericResponse<IEvent[]>) => {
          if (res && res.errorCode === 0) {
            this.eventsListsHolder = res.result;
            this.totalOnlineUser = this.eventsListsHolder[0].usersLogged;
            this.eventsListsHolder = this.eventsListsHolder
              .filter((event) => event.status === 0)
              .map((event) => {
                if (event.markets) {
                  if (+event.eventTypeId === 1) {
                    event.markets = event.markets.sort((a, b) => {
                      return a.marketName > b.marketName ? 1 : -1;
                    });
                  }
                }
                return event;
              })
              .filter((event) => event.markets && event.markets.length > 0);
            this.eventsLists = [...this.eventsListsHolder];
            this.eventsLists.sort(
              (a, b) => Date.parse(a.time) - Date.parse(b.time)
            );

            this.filterSport();
          }
          this.loadingService.setLoading(false);
        });
      this.subSink.add(listGameSub);
    }
  }

  getVirtualGameList() {
    // this.eventsLists = [];
    if (!this.isVirtualInTransit) {
      this.isVirtualInTransit = true;
      this.loadingService.setLoading(true);
      let virtualGameSub = this.eventsService
        .listVirtualGames()
        .pipe(finalize(() => (this.isVirtualInTransit = false)))
        .subscribe((res: GenericResponse<IEvent[]>) => {
          if (res && res.errorCode === 0) {
            this.loadingService.setLoading(false);
            this.eventsListsHolder = res.result;
            this.totalOnlineUser = this.eventsListsHolder[0].usersLogged;
            this.eventsListsHolder.map((event) => {
              if (+event.eventTypeId === 1) {
                event.markets = event.markets.sort((a, b) => {
                  return a.marketName > b.marketName ? 1 : -1;
                });
              }
            });
            this.eventsListsHolder = this.eventsListsHolder.filter(
              (event) => event.markets && event.markets.length > 0
            );
            this.eventsLists = this.eventsListsHolder;
            this.eventsLists.sort(
              (a, b) => Date.parse(a.time) - Date.parse(b.time)
            );

            this.filterSport();
          }
          this.loadingService.setLoading(false);
        });
      this.subSink.add(virtualGameSub);
    }
  }

  getActivateGame() {
    if (!this.isActiveGamesInTransit) {
      this.isActiveGamesInTransit = true;
      this.activeGames = [];
      this.loadingService.setLoading(true);
      let activeGameSub = this.eventsService
        .activateListGame()
        .pipe(finalize(() => (this.isActiveGamesInTransit = false)))
        .subscribe((res: any) => {
          if (res && res.errorCode === 0 && res.result.length) {
            this.activeGamesHolder = res.result;
            this.totalOnlineUser = this.activeGamesHolder[0].usersLogged;
            this.activeGamesHolder.map((event) => {
              if (+event.eventTypeId === 1) {
                event.markets = event.markets.sort((a, b) => {
                  return a.marketName > b.marketName ? 1 : -1;
                });
              }
            });
            this.activeGames = Object.assign([], this.activeGamesHolder).sort(
              (a, b) => Date.parse(a.time) - Date.parse(b.time)
            );
            this.filterSport();
          }
          this.loadingService.setLoading(false);
        });
      this.subSink.add(activeGameSub);
    }
  }

  selectTab(tabIndex) {
    // this.eventsLists = [];

    if (tabIndex == 1 || tabIndex == 2) {
      this.getActivateGame();
    } else if (tabIndex == 3) {
      this.getVirtualGameList();
    } else if (tabIndex == 0) {
      this.eventsLists = [];
      this.getGameList();
    }
    this.selectAll = false;
    this.selectedTabIndex = tabIndex;
    //  console.log(this.selectedTabIndex)
  }

  toggleExpand(event, id: any) {
    let state = document.getElementById(id).style.display;
    if (state === 'none') {
      document.getElementById(id).style.display = 'table-row';
      event.target.className = 'expand-open';
    } else {
      document.getElementById(id).style.display = 'none';
      event.target.className = 'expand-close';
    }
  }

  toggleExpandMarkets(event, id: any) {
    let els = document.getElementsByClassName(id);
    if ((<HTMLElement>els[0]).style.display === 'none') {
      for (let i = 0; i < els.length; i++) {
        const element = <HTMLElement>els[i];
        element.style.display = 'table-row';
      }
      event.target.className = 'expand-open';
    } else {
      for (let i = 0; i < els.length; i++) {
        const element = <HTMLElement>els[i];
        element.style.display = 'none';
      }
      event.target.className = 'expand-close';
    }
  }

  toggleMarkets(event, id: any) {
    let state = document.getElementById(id).style.display;
    if (state === 'none') {
      document.getElementById(id).style.display = 'flex';
      event.target.className = 'expand-open';
    } else {
      document.getElementById(id).style.display = 'none';
      event.target.className = 'expand-close';
    }
  }

  toggleEventStatus(checked, event) {
    // console.log(event);
    // let i = this.eventsLists.findIndex((e) => e.id === event.id);
    // if (i > -1) {
    //   let event = this.eventsLists[i];
    //   if (event.status === 1) {
    //     this.eventsLists[i].status = 0;
    //   } else {
    //     this.eventsLists[i].status = 1;
    //   }
    // }

    if (checked) {
      this.eventsService
        .activeGame(
          event.markets.reduce((acc, c) => {
            acc.push(c.gameId);
            return acc;
          }, [])
        )
        .subscribe((res: GenericResponse<any>) => {
          // console.log();
          if (res.errorCode == 0) {
            this.toastr.success('Activated Game');
          } else {
            this.toastr.error('Something went wrong');
          }
        });
    } else {
      this.eventsService
        .excludeGames(
          event.markets.reduce((acc, c) => {
            acc.push(c.gameId);
            return acc;
          }, [])
        )
        .subscribe((res: GenericResponse<any>) => {
          // console.log();
          if (res.errorCode == 0) {
            this.toastr.success('Deactivated Game');
          } else {
            this.toastr.error('Something went wrong');
          }
        });
    }
  }

  toggleMarketStatus(checked, mktid) {
    if (checked) {
      this.eventsService
        .activeGame(
          [mktid]
        )
        .subscribe((res: GenericResponse<any>) => {
          // console.log();
          if (res.errorCode == 0) {
            this.toastr.success('Activated Market');
          } else {
            this.toastr.error('Something went wrong');
          }
        });
    } else {
      this.eventsService
        .excludeGames(
          [mktid]
        )
        .subscribe((res: GenericResponse<any>) => {
          // console.log();
          if (res.errorCode == 0) {
            this.toastr.success('Deactivated Market');
          } else {
            this.toastr.error('Something went wrong');
          }
        });
    }
  }

  toggleInplay(eventId) {
    let gamesIds = this.activeGames
      .filter((e) => e.eventId === eventId)
      .reduce((res, cur) => {
        return [...res, ...cur.markets.map((m) => m.gameId)];
      }, []);
    this.eventsService
      .inplayGames(gamesIds)
      .subscribe((res: GenericResponse<any[]>) => {
        if (res && res.errorCode === 0) {
          this.onRefresh();
          this.toastr.success(`${res.result.length} games are now Inplay.`);
        }
      });
  }

  toggleVirtualInplay(checked: boolean, eventId: number) {
    if (checked) {
      let gamesIds = this.eventsLists
        .filter((e) => e.eventId === eventId)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);
      this.eventsService
        .inplayGames(gamesIds)
        .subscribe((res: GenericResponse<any[]>) => {
          if (res && res.errorCode === 0) {
            this.getVirtualGameList();
            this.toastr.success(`${res.result.length} games are now Inplay.`);
          }
        });
    } else {
      let gamesIds = this.eventsLists
        .filter((e) => e.eventId === eventId)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);
      this.eventsService
        .ReverseInplayGames(gamesIds)
        .subscribe((res: GenericResponse<any[]>) => {
          if (res && res.errorCode === 0) {
            this.getVirtualGameList();
            this.toastr.success(`${res.result.length} games are now Reverse From Inplay.`);
          }
        });
    }
  }

  toggleSelectAll(checked: boolean, tab: number) {
    if (tab === 0 && this.eventsLists) {
      if (checked) {
        this.eventsLists.forEach((event) => (event.activeStatus = 1));
      } else {
        this.eventsLists.forEach((event) => (event.activeStatus = 0));
      }
    } else if (tab === 1 && this.activeGames) {
      if (checked) {
        this.activeGames
          .filter((event) => event.isInPlay === 1)
          .forEach((event) => (event.activeStatus = 1));
      } else {
        this.activeGames
          .filter((event) => event.isInPlay === 1)
          .forEach((event) => (event.activeStatus = 0));
      }
    } else if (tab === 2 && this.activeGames) {
      if (checked) {
        this.activeGames
          .filter((event) => event.isInPlay === 0)
          .forEach((event) => (event.activeStatus = 1));
      } else {
        this.activeGames
          .filter((event) => event.isInPlay === 0)
          .forEach((event) => (event.activeStatus = 0));
      }
    }
  }

  activateGame(event, gameId: number) {
    if (event.target.checked) {
      this.activeGameIds.push(gameId);
    } else {
      let index = this.activeGameIds.findIndex((e) => e === gameId);
      this.activeGameIds.slice(index, 1);
    }
  }

  openSportModal(event) {
    this.isSportModalOpen = true;
  }

  openTourModal(event) {
    this.isTourModalOpen = true;
  }

  openMatchModal(event) {
    this.isMatchModalOpen = true;
  }

  openBetModal(event) {
    this.isBetModalOpen = true;
  }

  filterSport(e?) {
    this.selectAll = false;
    this.toggleSelectAll(false, 0);
    this.toggleSelectAll(false, 1);
    this.toggleSelectAll(false, 2);
    if (e) {
      this.selectedSport = +e.target.value;
    }
    if (this.selectedSport && this.eventsListsHolder) {
      this.eventsLists = [
        ...this.eventsListsHolder.filter(
          (e) => +e.eventTypeId === this.selectedSport
        ),
      ];
    } else {
      this.eventsLists = [...this.eventsListsHolder];
    }
    this.eventsLists?.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

    if (this.selectedSport && this.activeGamesHolder) {
      this.activeGames = [
        ...this.activeGamesHolder.filter(
          (e) => +e.eventTypeId === this.selectedSport
        ),
      ];
    } else {
      this.activeGames = [...this.activeGamesHolder];
    }
    this.activeGames?.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
  }

  changeSport(e) {
    this.gameId = e.target.value;
    this.eventsLists = [];
    this.loadingService.setLoading(true);
    this.eventsService.getGame(this.gameId).subscribe((res: any) => {
      if (res && res.errorCode === 0) {
        this.eventsListsHolder = res.result;
        this.eventsLists = [
          ...this.eventsListsHolder?.sort(
            (a, b) => Date.parse(a.time) - Date.parse(b.time)
          ),
        ];
      }
      this.loadingService.setLoading(false);
    });
  }

  onRefresh() {

    setTimeout(() => {
      if (this.selectedTabIndex == 1) {
        setTimeout(() => {
          this.getActivateGame();
        }, 1000);

      } else if (this.selectedTabIndex == 2) {
        setTimeout(() => {
          this.getActivateGame();
        }, 1000);
      } else if (this.selectedTabIndex == 0) {
        setTimeout(() => {
          this.getGameList();
        }, 1000);
      } else if (this.selectedTabIndex == 3) {
        this.getVirtualGameList();
      }
      this.activeGameIds = [];
    }, 1000)
  }

  activatedCheck(e) {
    if (e.target.checked) {
      let activeGameIds = this.eventsLists
        .filter((event) => event.activeStatus)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);

      this.activeGameIds = this.activeGameIds.concat(activeGameIds);

      if (this.activeGameIds.length > 0) {
        this.importingGames = true;
        this.eventsService
          .activeGame(this.activeGameIds)
          .subscribe((res: any) => {
            if (res && res.errorCode === 0) {
              this.onRefresh();
              this.toastr.success('Activated Selected Games');
            }
            this.importingGames = false;
          });
      } else {
        this.toastr.error('Please select Games to activate');

        (<HTMLInputElement>(
          document.getElementById('activateGamesToggle')
        )).checked = false;
      }
    }
  }

  deactivateCheck(e) {
    if (!e.target.checked) {
      let deactiveGameIds = this.activeGames
        .filter((event) => event.activeStatus)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);

      this.deactiveGameIds = this.deactiveGameIds.concat(deactiveGameIds);

      if (this.deactiveGameIds.length > 0) {
        this.deactivatingGames = true;
        this.eventsService
          .excludeGames(this.deactiveGameIds)
          .subscribe((res: any) => {
            if (res && res.errorCode === 0) {
              this.onRefresh();
              this.toastr.success('Deactivated Selected Games');
            }
            this.deactivatingGames = false;
          });
      } else {
        this.toastr.error('Please select Games to deactivate');

        (<HTMLInputElement>(
          document.getElementById('deactivateGamesToggle')
        )).checked = true;
      }
    }
  }

  search(value) {
    this.eventsLists = [...this.eventsListsHolder];
    this.activeGames = [...this.activeGamesHolder];

    this.filterSport();

    if (this.eventsLists) {
      this.eventsLists = this.eventsLists.filter(
        (e) =>
          e.eventName.toLowerCase().includes(value) ||
          e.competitionName.toLowerCase().includes(value) ||
          e.sportsName.toLowerCase().includes(value)
      );
    }
    if (this.activeGames) {
      this.activeGames = this.activeGames.filter(
        (e) =>
          e.eventName?.toLowerCase().includes(value) ||
          e.competitionName?.toLowerCase().includes(value) ||
          e.sportsName?.toLowerCase().includes(value)
      );
    }
  }

  activateEvent(checked, eventId: number) {
    if (checked) {
      let activeGameIds = this.eventsLists
        .filter((event) => event.eventId === eventId)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);

      this.importingGames = true;
      this.eventsService.activeGame(activeGameIds).subscribe((res: any) => {
        if (res && res.errorCode === 0) {
          this.onRefresh();
          this.toastr.success('Activated Selected Games');
        }
        this.importingGames = false;
      });
    }
  }

  deactivateEvent(checked, eventId: number) {
    if (!checked) {
      let excludeGameIds = this.activeGames
        .filter((event) => event.eventId === eventId)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);

      this.deactivatingGames = true;
      this.eventsService.ReverseInplayGames(excludeGameIds).subscribe((res: any) => {
        if (res && res.errorCode === 0) {
          this.onRefresh();
          this.toastr.success('Reversed Selected Games From Inplay');
        }
        this.deactivatingGames = false;
      });
    }
  }

  toggleVirtualActivation(checked, eventId: number) {
    if (checked) {
      let activeGameIds = this.eventsLists
        .filter((event) => event.eventId === eventId)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);

      this.importingGames = true;
      this.eventsService.activeGame(activeGameIds).subscribe((res: any) => {
        if (res && res.errorCode === 0) {
          this.getVirtualGameList();
          this.toastr.success('Activated Selected Games');
        }
        this.importingGames = false;
      });
    } else {
      let excludeGameIds = this.eventsLists
        .filter((event) => event.eventId === eventId)
        .reduce((res, cur) => {
          return [...res, ...cur.markets.map((m) => m.gameId)];
        }, []);

      this.deactivatingGames = true;
      this.eventsService.excludeGames(excludeGameIds).subscribe((res: any) => {
        if (res && res.errorCode === 0) {
          this.getVirtualGameList();
          this.toastr.success('Deactivated Selected Games');
        }
        this.deactivatingGames = false;
      });
    }
  }

  toggleActivateFancy(event, eventId, source) {
    if (event.target.checked) {
      this.eventsService
        .activateFancy([eventId], source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('fancies activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateFancy([eventId], source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('fancies deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }
  toggleActivatepremium(event, eventId) {
    if (event.target.checked) {
      this.eventsService
        .activatePremium([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Premium activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivatePremium([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success(' Premium deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }


  toggleActivateMO(event, eventId) {
    if (event.target.checked) {
      this.eventsService
        .activateMO([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Match Odds activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateMO([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success(' Match Odds deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleActivateOU(event, eventId) {
    if (event.target.checked) {
      this.eventsService
        .activateOU([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Over Under Market activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateOU([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success(' Over Under Market deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleActivateTM(event, eventId) {
    if (event.target.checked) {
      this.eventsService
        .activateTM([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Tied Market activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateTM([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success(' Tied Market deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleActivateTossM(event, eventId) {
    if (event.target.checked) {
      this.eventsService
        .activateTossM([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Toss Market activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateTossM([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success(' Toss Market deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }
  toggleActivateBM(event, eventId,source) {
    if (event.target.checked) {
      this.eventsService
        .activateBM([eventId],source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Bookmaker activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateBM([eventId],source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Bookmaker deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleFancy(event, eventId) {
    if (event.target.checked) {
      this.eventsService
        .stopFancy(eventId)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Fancies activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .startFancy(eventId)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Fancies deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleBM(event, eventId,source) {
    if (event.target.checked) {
      this.eventsService
        .activateBM(eventId,source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Bookmaker activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateBM(eventId,source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Bookmaker deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  lockRunner(market, selName, type) {
    market.runners.forEach(element => {
      if (selName == "all") {
        if (type == "back") {
          element.lockBackBets = !element.lockBackBets;
          market['lockBackALL'] = element.lockBackBets;

        }
        if (type == "lay") {
          element.lockLayBets = !element.lockLayBets;
          market['lockLayALL'] = element.lockLayBets;

        }
      } else if (element.selName == selName) {
        if (type == "backlay") {
          if(!element.lockBackBets || !element.lockLayBets){
            element.lockBackBets = true;
            element.lockLayBets = true;
          } else{
            element.lockBackBets = false;
            element.lockLayBets = false;
          }
     
        }
        if (type == "back") {
          element.lockBackBets = !element.lockBackBets;
        }
        if (type == "lay") {
          element.lockLayBets = !element.lockLayBets;
        }
      }
    });

    let reqData = {
      gameId: market.gameId,
      runners: market.runners,
    }

    this.eventsService.lockRunner(reqData).subscribe((res:any) => {
      if (res.errorCode === 0) {
        this.toastr.success('Runner Status Updated');
        // setTimeout(() => {
        //   this.getActivateGame();
        // }, 1000);
      } else {
        this.toastr.error(res.errorDescription);
      }
    })
  }

  toggleVirtualActivateFancy(event, eventId, source) {
    //  console.log(event.target.checked, eventId);
    if (event.target.checked) {
      this.eventsService
        .activateFancy([eventId], source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('fancies activated');
            this.getVirtualGameList();
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateFancy([eventId], source)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('fancies deactivated');
            this.getVirtualGameList();
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleActivateDraw(event, eventId) {
    //  console.log(event.target.checked, eventId);
    if (event.target.checked) {
      this.eventsService
        .activateDraw([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Draw activated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.eventsService
        .deactivateDraw([eventId])
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Draw deactivated');
            setTimeout(() => {
              this.getActivateGame();
            }, 1000);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    }
  }

  toggleSuspend(suspended, sportId, eventId) {
    if (suspended == 1) {
      if (!this.isSuspendInTransit) {
        this.isSuspendInTransit = true;
        this.eventsService
          .acceptBets(sportId, eventId)
          .pipe(finalize(() => (this.isSuspendInTransit = false)))
          .subscribe((res: GenericResponse<any>) => {
            //  console.log(res);
            this.onRefresh();
          });
      }
    } else {
      if (!this.isSuspendInTransit) {
        this.isSuspendInTransit = true;
        this.eventsService
          .suspendBets(sportId, eventId)
          .pipe(finalize(() => (this.isSuspendInTransit = false)))
          .subscribe((res: GenericResponse<any>) => {
            //  console.log(res);
            this.onRefresh();
          });
      }
    }

  }
  listUser() {
    this.adminList = [];
    this.playerList = [];
    this.fullHirarchySub = this.commonService._allUsersSub$.subscribe((res: any) => {
      // console.log(res);
      if (res) {
        this.usersListfilter = res;
        this.usersList = [];
        this.usersListfilter.forEach(users => {
          if (users.userType != 8) {
            this.adminList.push(users)
          }
          if (users.userType == 8) {
            this.playerList.push(users)
          }
        });
        this.totalAdmin = this.adminList?.length;
        if (this.userType === 1 || this.userType === 2 || this.userType === 3) {
          this.totalAdmin = this.adminList?.length;
          this.totalPlayer = +((this.playerList?.length + (this.playerList?.length * this.userMultiplier)).toFixed(0));
          this.totalUser = this.totalAdmin + this.totalPlayer;
        }
        else {
          this.totalPlayer = this.playerList?.length;
          this.totalUser = this.usersListfilter?.length;
        }
        this.loadingService.setLoading(false);
      }
    })
  }
  closeEvent(sportId, eventId) {
    this.eventsService.closeEvent(sportId, eventId);
  }

  trackByFn(index, item) {
    //  console.log(index, item);

    return index;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
    if (this.fullHirarchySub) {
      this.fullHirarchySub.unsubscribe();
    }
    this.loadingService.setLoading(false);
  }
}
