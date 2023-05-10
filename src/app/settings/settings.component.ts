import { UpperCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { EventsService } from '../events/events.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { DataFormatService } from '../services/data-format.service';
import { ShareDataService } from '../services/share-data.service';
import { CurrentUser } from '../shared/models/current-user';
import { IEvent } from '../shared/types/event';
import { GenericResponse } from '../shared/types/generic-response';
import { Hierarchy } from '../shared/types/hierarchy';
import { IMarket } from '../shared/types/market';
import { TeenpattiService } from '../teenpatti/teenpatti.service';
import { ICasinoMarket, ICasinoTable } from '../teenpatti/types/casino-table';
import { IUserList } from '../users/models/user-list';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { SettingsService } from './settings.service';
import { environment } from 'src/environments/environment';

export class SettingsWise {
  typeWise: string;
  userId: string;
  usersWise: string;
  sport: string;
  sportType: string;
  competition: string;
  event: string;
  market: string;
  marketName: string;
}

const removeEmpty = (obj) =>
  Object.keys(obj)
    .filter((k) => obj[k] != null) // Remove undef. and null.
    .reduce(
      (newObj, k) =>
        typeof obj[k] === 'object'
          ? { ...newObj, [k]: removeEmpty(obj[k]) } // Recurse.
          : { ...newObj, [k]: obj[k] }, // Copy value.
      {}
    );

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('userWise') userWise: ElementRef;
  hierarchyList = Array<Hierarchy>();
  currentUser: CurrentUser;
  usersListMap: { userType: number; users: User[] } | {} = {};

  settingForm: FormGroup;

  private _settingsWiseSubject = new BehaviorSubject<SettingsWise>(
    new SettingsWise()
  );
  private settingsWise$ = this._settingsWiseSubject.asObservable();

  showLimitSettings = true;
  showMarketSettings = true;
  showPremiumSettings = false;
  showSessionSettings = true;
  siteName = environment.siteName;
  showBookSettings: boolean = false;
  competitionList: IEvent[];
  eventsList: IEvent[];
  marketList: IMarket[];

  settingFormInitialVal;

  sportsEventIds = [
    { name: 'Soccer', id: '1' },
    { name: 'Tennis', id: '2' },
    { name: 'Cricket', id: '4' },
    { name: 'Teenpatti/ X-Games', id: 'casino' },
    { name: 'Horse Racing', id: '7' },
    { name: 'Greyhound Racing', id: '4339' },
    { id: "7522", fillname: 'Basketball', name: 'Basketball' },
    { id: "998917", fillname: 'Volleyball', name: 'Volleyball' },
    { id: "6422", fillname: 'Snooker', name: 'Snooker' },
    { id: "8", fillname: 'Motor Sport', name: 'Motor Sport' },
    { id: "7524", fillname: 'Ice Hockey', name: 'Ice Hockey' },
    { id: "3", fillname: 'Golf ', name: 'Golf' },
    { id: "27454571", fillname: 'Esports', name: 'Esports' },
    { id: "3503", fillname: 'Darts', name: 'Darts' },
    { id: "11", fillname: 'Cycling', name: 'Cycling' },
    { id: "6", fillname: 'Boxing', name: 'Boxing' },
    { id: "6423", fillname: 'American Footbal', name: 'American Football' },
    { id: "2152880", fillname: 'Gaelic Games', name: 'Gaelic Games' },
    { id: "468328", fillname: 'Handball', name: 'Handball' },
    { id: "1477", fillname: 'Rugby League', name: 'Rugby League' },
    { id: "5", fillname: 'Rugby Union', name: 'Rugby Union' },
    { id: "61420", fillname: 'Australian Rules', name: 'Australian Rules' },
    { id: "2378961", fillname: 'Politics', name: 'Politics' },
    { id: "52", fillname: 'Kabaddi', name: 'Kabaddi' },
    { id: "451485", fillname: 'Winter Sports', name: 'Winter Sports' },
    { id: "26420387", fillname: 'Mixed Martial Arts', name: 'Mixed Martial Arts' },
  ];


  sports = [
    { name: 'soccer', id: '1' },
    { name: 'tennis', id: '2' },
    { name: 'cricket', id: '4' },
    { name: 'casino', id: 'casino' },
    { name: 'horses', id: '7' },
    { name: 'horses', id: '4339' },
  ];

  casinoTablesList: ICasinoTable[];
  casinoMarketsList: ICasinoMarket[] = [];
  Update: any;
  sportsid: any;
  showpretab: boolean = false;

  constructor(
    private commonService: CommonService,
    private usersService: UsersService,
    private settingsService: SettingsService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private eventsService: EventsService,
    private dataFormatService: DataFormatService,
    private teenPattiService: TeenpattiService,
    private shareService: ShareDataService,
    private authService: AuthService,
  ) {

    this.currentUser = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.getlanguages();
    this.settingForm = this.formBuilder.group({
      userId: ['0'],
      typeWise: ['default'],
      value: ['0'],
      sportId: ['0'],
      competitionName: ['0'],
    });

    this.addLimitControl();
    this.addSessionControl();
    this.addMarketControl();
    this.addPremiumControl();
    this.addBookmakingControl();

    this.settingFormInitialVal = this.settingForm.value;

    this.commonService.hierarchyList$.subscribe((list) => {
      this.hierarchyList = list;
    });
    this.commonService.hierarchyMap$.subscribe((map) => {
      if (this.currentUser.userType == 2) {
        this.showpretab = true
      
      }
    })

    let getSettingsData = {
      typeWise: this.settingForm.get('typeWise').value,
      value: this.settingForm.get('value').value,
      userId: this.settingForm.get('userId').value,
      sportId: this.settingForm.get('sportId').value
    };
    this.commonService.apis$.subscribe((res) => {
      this.usersService
        .listUser(this.auth.currentUser.userId, undefined, 'active')
        .subscribe((res: GenericResponse<IUserList[]>) => {
          if (res.errorCode === 0) {
            res.result[0].users.forEach((user) => {
              if (user.userType in this.usersListMap) {
                this.usersListMap[user.userType].push(user);
              } else {
                this.usersListMap[user.userType] = [user];
              }
            });
          }
        });
      this.getSettings();

      // this.settingsService
      //   .listSetting(getSettingsData)
      //   .subscribe((res: GenericResponse<any>) => {
      //     if (res && res.errorCode === 0) {
      //       if (res.result.length) {
      //         res.result[0] = Object.entries(res.result[0]).reduce(
      //           (acc, [key, value]) => {
      //             if (value && typeof value == 'object') {
      //               value = Object.entries(value).reduce((a, [k, v]) => {
      //                 if (v) {
      //                   a[k] = v;
      //                 }
      //                 return a;
      //               }, {});
      //             }
      //             if (!!value) {
      //               acc[key] = value;
      //             }
      //             return acc;
      //           },
      //           {}
      //         );
      //         this.resetSettingInputs();
      //         this.settingForm.patchValue(res.result[0]);
      //       } else {
      //         this.resetSettingInputs();
      //       }
      //     } else {
      //       this.resetSettingInputs();
      //     }
      //   });

      this.eventsService
        .activateListGame()
        .subscribe((res: GenericResponse<IEvent[]>) => {
          if (res.errorCode === 0 && res.result) {
            this.eventsList = res.result;
            this.eventsList = this.eventsList.filter((e) => e.markets);
            this.eventsList.forEach((event) => {
              event.markets.map((market) => {
                market.sportsName = event.sportsName;
              });
            });
            this.competitionList = this.dataFormatService.competitionWise(
              this.eventsList
            );
            // console.log(this.competitionList);

            this.marketList = this.dataFormatService.marketWise(
              this.eventsList
            );
          }
        });

      this.teenPattiService
        .listTeenpatti()
        .subscribe((res: GenericResponse<ICasinoTable[]>) => {
          if (res.errorCode === 0) {
            this.casinoTablesList = res.result;
            this.casinoTablesList.forEach((table) => {
              let m: ICasinoMarket;
              table.markets?.forEach((market) => {
                m = {
                  tableName: table.tableName,
                  marketName: market.marketName,
                  gameId: market.gameId,
                };
                this.casinoMarketsList.push(m);
              });
            });
          }
        });
    });

    this.settingsWise$.subscribe((settingsWise) => {
      getSettingsData = {
        typeWise: this.settingForm.get('typeWise').value,
        value: this.settingForm.get('value').value,
        userId: this.settingForm.get('userId').value,
        sportId: this.settingForm.get('sportId').value,
      };

      if (
        settingsWise.sport &&
        settingsWise.sport !== '4' &&
        settingsWise.sport !== '-1' &&
        settingsWise.sportType === 'teenpatti' &&
        settingsWise.sport !== '0'
      ) {
        this.showSessionSettings = false;
        this.showBookSettings = false;
        this.settingForm.removeControl('sessionSetting');
        this.settingForm.removeControl('bookSettings');
        this.settingForm.updateValueAndValidity();
      } else {
        this.showSessionSettings = true;
        this.showBookSettings = true;
        this.addSessionControl();
        this.addBookmakingControl();
        this.settingForm.updateValueAndValidity();
      }
      if (settingsWise.sport && settingsWise.sport === '-2') {
        this.showMarketSettings = false;
        this.settingForm.removeControl('marketSetting');
        this.settingForm.updateValueAndValidity();
      } else {
        this.showMarketSettings = true;
        this.addMarketControl();
        this.settingForm.updateValueAndValidity();
      }
      if (this.showpretab) {
        if (this.siteName == 'cricBuzzer' || this.siteName == 'lc247') {
          if (settingsWise.sport === '1' || settingsWise.sport === '2' || settingsWise.sport === '4') {
            this.showPremiumSettings = true;
            this.addPremiumControl();
            this.settingForm.updateValueAndValidity();
          } else {
            this.showPremiumSettings = false;
            this.settingForm.removeControl('premiumSetting');
            this.settingForm.updateValueAndValidity();
          }
        }
      }
      if (settingsWise.sport && settingsWise.typeWise === 'market') {
        if (settingsWise.sport !== '-1' && settingsWise.sport !== '-2') {
          this.settingForm
            .get('limitSetting')
            .get('bookmakingCommission')
            .disable();
        } else if (settingsWise.sport === '-1') {
          this.settingForm
            .get('limitSetting')
            .get('matchOddsCommission')
            .disable();
        } else if (settingsWise.sport === '-2') {
          this.settingForm
            .get('limitSetting')
            .get('matchOddsCommission')
            .disable();
          this.settingForm
            .get('limitSetting')
            .get('bookmakingCommission')
            .disable();
        } else {
          this.settingForm
            .get('limitSetting')
            .get('bookmakingCommission')
            .enable();
          this.settingForm
            .get('limitSetting')
            .get('matchOddsCommission')
            .enable();
        }
      } else {
        this.settingForm
          .get('limitSetting')
          .get('bookmakingCommission')
          .enable();
        this.settingForm
          .get('limitSetting')
          .get('matchOddsCommission')
          .enable();
      }

      if (settingsWise.sport == '7' || settingsWise.sport == '4339') {
        this.limitSetting.get('noMinutesBeforeInplay').enable();
      } else {
        // this.limitSetting.get('noMinutesBeforeInplay').disable();
      }
    });
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if (data != null) {
        this.Update = data;
        console.log(this.Update);
      }

    })
  }
  addLimitControl() {
    let limitSetting = this.formBuilder.group({
      exposureLimit: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      betDelay: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      bookmakingCommission: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      matchOddsCommission: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      noMinutesBeforeInplay: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
    });
    this.settingForm.addControl('limitSetting', limitSetting);
  }

  addSessionControl() {
    let sessionFormGroup = this.formBuilder.group({
      minStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxProfit: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxLoss: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      commission: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      perRateMaxStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      fancyBonus: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      betDelay: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
    });
    this.settingForm.addControl('sessionSetting', sessionFormGroup);
  }

  addMarketControl() {
    let marketFormGroup = this.formBuilder.group({
      betMinRate: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      betMaxRate: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      minStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxProfit: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxLoss: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      volMultiplier: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      marketBeforeInplayLimit: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
    });
    this.settingForm.addControl('marketSetting', marketFormGroup);
  }
  addPremiumControl() {
    let premiumFormGroup = this.formBuilder.group({
      betDelay: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      minStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxProfit: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),

    });
    this.settingForm.addControl('premiumSetting', premiumFormGroup);
  }
  addBookmakingControl() {
    let bookFormGroup = this.formBuilder.group({
      betDelay: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      minStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxProfit: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      maxLoss: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
      perRateMaxStake: this.formBuilder.group({
        value: [],
        inherited: [false],
      }),
    });
    this.settingForm.addControl('bookSettings', bookFormGroup);
  }

  getSettings() {
    let getSettingsData = {
      typeWise: this.settingForm.get('typeWise').value,
      value: this.settingForm.get('value').value,
      userId: this.settingForm.get('userId').value,
      sportId: this.settingForm.get('sportId').value
    };
    this.settingsService
      .listSetting(getSettingsData)
      .subscribe((res: GenericResponse<any>) => {
        if (res && res.errorCode === 0) {
          if (res.result.length) {
            res.result[0] = Object.entries(res.result[0]).reduce(
              (acc, [key, value]) => {
                if (!!value) {
                  Object.entries(value).reduce((a, [k, v]) => {
                    if (!!v) {
                      a[k] = v;
                    }
                    return a;
                  }, {});
                }
                if (!!value) {
                  acc[key] = value;
                }
                return acc;
              },
              {}
            );
            this.resetSettingInputs();
            this.settingForm.patchValue(res.result[0]);
          } else {
            this.resetSettingInputs();
          }
        } else {
          this.resetSettingInputs();
        }
      });
  }

  get limitSetting() {
    return this.settingForm.get('limitSetting');
  }

  get marketSetting() {
    return this.settingForm.get('marketSetting');
  }
  get premiumSetting() {
    return this.settingForm.get('premiumSetting');
  }

  get sessionSetting() {
    return this.settingForm.get('sessionSetting');
  }

  get bookSetting() {
    return this.settingForm.get('bookSettings');
  }

  resetSettingInputs() {
    this.settingForm
      .get('limitSetting')
      .reset(this.settingFormInitialVal.limitSetting);
    if (this.settingForm.get('marketSetting')) {
      this.settingForm
        .get('marketSetting')
        .reset(this.settingFormInitialVal.marketSetting);
    }
    if (this.settingForm.get('premiumSetting')) {
      this.settingForm
        .get('premiumSetting')
        .reset(this.settingFormInitialVal.premiumSetting);
    }
    if (this.settingForm.get('sessionSetting')) {
      this.settingForm
        .get('sessionSetting')
        .reset(this.settingFormInitialVal.sessionSetting);
    }
    if (this.settingForm.get('bookSettings')) {
      this.settingForm
        .get('bookSettings')
        .reset(this.settingFormInitialVal.bookSettings);
    }
  }

  submit() {
    //  console.log(this.settingForm.value);
    if (this.settingForm.valid) {
      this.settingsService
        .setSetting(this.settingForm.value)
        .subscribe((res: GenericResponse<any>) => {
          if (res && res.errorCode === 0) {
            // this.toastr.success(res.errorDescription);
            this.getSettings();
            this.toastr.success('Settings Saved');
            // history.back();
          } else {
            this.toastr.error(res.errorDescription);
            this.getSettings();
          }
        });
    } else {
      this.toastr.error('Invalid Input');
    }
  }

  sportwisedefault() {
    let settingWise = this._settingsWiseSubject.getValue();
    let sport = this.sports.find(element => element.id === settingWise.sport);
    if (sport == undefined) {
      this.toastr.error("Not a sport type");
      return false;
    }
    this.settingsService
      .setdefaultSetting(sport.name)
      .subscribe((res: GenericResponse<any>) => {
        if (res && res.errorCode === 0) {
          // this.toastr.success(res.errorDescription);
          this.getSettings();
          this.toastr.success('Default Settings Saved for ' + sport.name.toUpperCase());
          // history.back();
        } else {
          this.toastr.error(res.errorDescription);
          this.getSettings();
        }
      });

  }

  setUsersWise(event: Event, id?: string) {
    // if (+this.settingForm.get('value').value === 0) {
    this.settingForm.get('userId').setValue(0);
    // }
    // (<HTMLInputElement>event.target).value = '';
    // this.userWise.nativeElement.value = '';
    if ((<HTMLInputElement>event.target).checked) {
      let elements = <HTMLCollectionOf<HTMLElement>>(
        document.getElementsByClassName('user-wise')
      );
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.style.display = 'none';
      }
      if (id) {
        // document.getElementById(id).style.display = 'block';
        document.getElementById(id + 'Input').style.display = 'block';
      }
    }

    this.settingForm.get('userId').setValue(0);
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.usersWise = (<HTMLInputElement>event.target).value;
    settingWise.userId = '0';
    this._settingsWiseSubject.next(settingWise);
    this.getSettings();
    // console.log(settingWise);
  }

  setTypeWise(typeWise: string) {
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.sport = '0';
    settingWise.competition = '0';
    settingWise.event = '0';
    settingWise.market = '0';
    this.settingForm.get('value').setValue('0');
    this.settingForm.get('sportId').setValue('0');
    this.settingForm.get('competitionName').setValue('0');
    settingWise.typeWise = typeWise;
    this._settingsWiseSubject.next(settingWise);
    this.getSettings();
    // console.log(settingWise);
  }

  selectSport(sportId: string, sport: string) {
    this.sportsid = sportId
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.sport = sportId;
    sport ? (settingWise.sportType = sport) : (settingWise.sportType = '');
    this._settingsWiseSubject.next(settingWise);

    this.getSettings();
  }
  selectCompetition(competition: string, sport: string) {
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.competition = competition;
    sport ? (settingWise.sportType = sport) : (settingWise.sportType = '');
    let selectedCompetition = this.competitionList.find(
      (comp) => comp.competitionId == +settingWise.competition
    );

    if (selectedCompetition) {
      // console.log(selectedCompetition);
      settingWise.sport = selectedCompetition.sportId;
      this.settingForm.get('sportId').setValue(selectedCompetition.sportId);
      this.settingForm.get('competitionName').setValue(selectedCompetition.competitionName);
    } else {
      settingWise.sport = null;
    }
    this._settingsWiseSubject.next(settingWise);
    this.getSettings();
  }
  selectEvent(eventId: string) {
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.event = eventId;
    settingWise.sportType = 'teenpatti';
    //  console.log(eventId, typeof eventId);
    let event = this.eventsList.find(
      (event) => event.eventId === +settingWise.event
    );
    if (event) {
      settingWise.sport = event.eventTypeId;
    } else {
      settingWise.sport = null;
    }
    this._settingsWiseSubject.next(settingWise);
    this.getSettings();
  }

  selectMarket(gameId: string, sport: string) {
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.market = gameId;
    let market = this.marketList.find((market) => market.gameId === +gameId);

    if (market) {
      settingWise.sport = market.eventTypeId;
    } else {
      settingWise.sport = this.casinoMarketsList.find(
        (market) => market.gameId === gameId
      ).tableName;
      settingWise.sportType = 'teenpatti';
    }
    this._settingsWiseSubject.next(settingWise);
    this.getSettings();
  }

  back() {
    history.back();
  }

  selectUser(userId: string) {
    let settingWise = this._settingsWiseSubject.getValue();
    settingWise.userId = userId;
    this._settingsWiseSubject.next(settingWise);
    this.getSettings();
  }
}
