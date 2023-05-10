import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnvService } from '../env.service';
import { EventsService } from '../events/events.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { CurrentUser } from '../shared/models/current-user';
import { Hierarchy } from '../shared/types/hierarchy';
import { ThemeService } from '../theme';
import { Theme } from '../theme/symbols';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscriptions: Subscription;
  dateTime: Date;
  currentUser?: CurrentUser;
  balance: number = 0;
  isBalanceLoader = false
  // hierarchyMap: Map<number, Hierarchy>;
  showMenu: boolean = false;
  isVrnladmin: boolean = false;
  xpgPay: boolean = false;
  b2c= environment.isB2C;
  showMMtab: boolean = false;
  heirarchyList?: Hierarchy[];
  siteName = environment.siteName;
  showTeenpatti: boolean;
  restrictedTabs: boolean = true;
  showsettingtab: boolean = false;
  restrictedTab: boolean = false;
  showmmtab:boolean=false
  showsport: boolean = false;
  isOpen: boolean = false;
  balanceLabel: string;
  currencyCode = environment.currency;
  timeFormat = environment.timeFormat;
  manual = environment.manual;
  internationalCasino = environment.internationalCasino;
  isSupernova = environment.isSupernova;
  isPremiumSite = environment.isPremiumSite;
  isRental=environment.isRental;
  isBdlevel = environment.isBdlevel;
  showActions: boolean = false;
  domainAllow: boolean = false;
  oldAdmin = environment.oldAdmin;
  isSlot=environment.isSlot;
  isbetgame=environment.isbetgame
  isPoker=environment.isPoker;
  isAWCcasino = environment.isAWCcasino;
  islanguage=environment.islanguage
  belock: any;
  transferLock: any;
  selectedlanguage: string = '';
  language: any;
  range = "en";
  Alllanguage: any;
  Update: any;
  currentlanguage: string;
  selectedlang: any;
  constructor(
    public common: CommonService,
    public router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private envService: EnvService,
    private themeService: ThemeService,
    private tokenService: TokenService,
    private shareService: ShareDataService,
    private eventsService: EventsService, private loadingService: LoadingService,
    private meta: Meta
  ) {
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage()
      this.selectlanguage(this.selectedlang)
    } else {
      this.selectlanguage('en')
    }
    this.dateTime = new Date();
    if (this.oldAdmin) {
      this.meta.updateTag({ name: 'viewport', content: 'width=1200' });
    }
  }

  fixCurrency = environment?.currency;
  themeName: Theme;
  ngOnInit(): void {
    this.getlanguages()
    this.balanceLabel = this.envService?.environment?.balanceLabel;
    this.showMMtab = this.envService?.environment?.show_set_MM_msgs_tabs;
    interval(1000).subscribe(() => {
      this.dateTime = new Date();
    });

    this.themeName = this.themeService.getActiveTheme();
    ////  console.log("Name of the theme",this.themeName);

    this.currentUser = this.authService.currentUser;
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        // this.currencyCode = environment.currency
        //   ? this.currentUser?.currencyCode
        //   : environment.currency;
        this.currencyCode = this.currentUser?.currencyCode;
      }
    });
    this.subscriptions = this.common.apis$.subscribe((res) => {
      if (this.currentUser.userType == 1) {
        this.betTransferStatus();
      }
      if ((this.currentUser.userName == "XPGPay" && environment.siteName == "cricBuzzer")) {
        this.xpgPay = true;
      }
    });

    this.common.hierarchyMap$.subscribe((map) => {
     
      this.showMenu = true;
        if (this.currentUser.userType <= 4) {
          this.showsettingtab = true;
          this.restrictedTab = true;
          this.showmmtab = true;
        } else {
          this.showsettingtab = false;
          this.restrictedTab = false;
          this.showmmtab = false;
        }
      
      if (environment.siteName == 'lc247') {
        if (this.currentUser.userType == 1 || this.currentUser.userType == 2) {
          this.restrictedTab = true;
          this.showsettingtab = true;
        } else {
          this.restrictedTab = false;
          this.showsettingtab = false;
        }
      }
      if (environment.siteName == 'luck247') {
        if (this.currentUser.userType == 1 || this.currentUser.userType == 2) {
          this.showsettingtab = true;
          this.showmmtab = true;
        } else {
          this.showsettingtab = false;
          this.showmmtab = false;
        }
      }
      if (environment.siteName == 'velkibuzz') {
        if (this.currentUser.userType > 4 && this.showMMtab) {
          this.restrictedTabs = false;
        } else {
          this.restrictedTabs = true;
        }
      }
      if (environment.siteName == 'nayaludis' || environment.siteName == 'velkiex' || environment.siteName == 'wicket9' || environment.siteName == 'baji365vip') {
        if (this.currentUser.userType == 1 || this.currentUser.userType == 2) {
          this.restrictedTab = true;
        } else {
          this.restrictedTab = false;
        }
      }
      
      if ( environment.siteName == 'lc247co' || environment.siteName == 'sports365' || environment.siteName == 'xpgexch'|| environment.siteName == 'xpgexchio' || environment.siteName == 'runexchpro' ) {
        if (this.currentUser.userType ==1 || this.currentUser.userType == 2) {
          this.restrictedTab = true;
        } else {
          this.restrictedTab = false;
        }
      }
      if (environment.siteName == 'mash247' || environment.siteName == 'bdbuzz365') {
        if (this.currentUser.userType == 2 || this.currentUser.userType == 1 || this.currentUser.userType == 3) {
          this.restrictedTab = true;
        } else {
          this.restrictedTab = false;
        }
      }
      if (environment.siteName == 'spacexch' || environment.siteName == 'vellkii') {
        if (this.currentUser.userType == 2 || this.currentUser.userType == 1) {
          this.restrictedTab = true;
        } else {
          this.restrictedTab = false;
        }
      }
      if (environment.siteName == 'theskyexchange') {
        if (this.currentUser.userType == 2 || this.currentUser.userType == 1) {
          this.restrictedTab = true;
        } else {
          this.restrictedTab = false;
        }
      }
      if (environment.siteName == 'jee365' || environment.siteName == 'star365') {
        if (this.currentUser.userType == 2 || this.currentUser.userType == 1) {
          this.showsettingtab = true;
        } else {
          this.showsettingtab = false;
        }
      }
      // For emran site allowed MM , message(Ticker)
      if (environment.siteName == 'rajbet' || environment.siteName == 'runx' || environment.siteName == 'vellki' || environment.siteName == 'sports365' || environment.siteName == 'baajighor365' ) {
        if (this.currentUser.userType < 8) {
          this.restrictedTab = true;
          if (this.currentUser.userType == 2 || this.currentUser.userType == 3) {
            this.showsettingtab = true;
          } else {
            this.showsettingtab = false;
          }
        }
      }

      if (environment.siteName == 'weexch666') {
        if (this.currentUser.userType <= 4) {
          this.showsettingtab = true;
        } else {
          this.showsettingtab = false;
        }
      }
      
      // For VRNL site allowed Settings,MM, message(Ticker)
      if (environment.siteName == 'lc247co' || environment.siteName == 'betwinners' || environment.siteName == 'baji365' || environment.siteName == 'bdwicket') {
        if (this.currentUser.userType < 8) {
          this.restrictedTab = true;
          if (this.currentUser.userType == 2 || this.currentUser.userType == 3) {
            this.showsettingtab = true;
          } else {
            this.showsettingtab = false;
          }
        } else {
          this.restrictedTab = false;
        }
      }
      // For VRNL site allowed Settings,MM, message(Ticker)
      if (environment.siteName == 'wickets3' || environment.siteName == 'velki123' || environment.siteName == 'winBuzz' || environment.siteName == 'cricBuzz365' || environment.siteName == 'wckt9' || environment.siteName == 'betx365') {
          if (this.currentUser.userType == 2 || this.currentUser.userType == 3 || this.currentUser.userType == 4) {
            this.showsettingtab = true;
            this.restrictedTab = true;
          } else {
            this.showsettingtab = false;
            this.restrictedTab = false;
          }
      }
      // For VRNL site allowed Settings
      if (environment.siteName == 'betswiz' || environment.siteName == 'skybet365' || environment.siteName == 'weexch666') {
        if (this.currentUser.userType <= 7) {
          this.showsettingtab = true;
        } else {
          this.showsettingtab = false;
        }
    }

      if (environment.siteName == 'baji365') {
        if (this.currentUser.userType <= 4) {
          this.restrictedTab = true;
        } else {
          this.restrictedTab = false;
        }
      }

      if (this.currentUser.userType === this.common.vrnlUserType) {
        this.isVrnladmin = true;
        this.internationalCasino = true;
        this.isSupernova = true;
        this.isSlot = true;
        this.isbetgame =true;
      }
      if (
        this.currentUser.userType === this.common.vrnlUserType ||
        this.currentUser.userType === this.common.whitelabelUserType
      ) {
        this.showTeenpatti = true;
        this.showsport = true;
        this.showActions = true;
      }
    });
    this.common.hierarchyList$.subscribe((list) => {
      this.heirarchyList = list;
      // if (this.isBdlevel) {
      //   this.heirarchyList?.forEach((user) => {

      //     if (user?.name.includes("whitelabel")) {
      //       user.name = 'Mother panel';
      //     }
      //     if (user?.name == ("admin")) {
      //       user.name = 'Whitelabel';
      //     }
      //     if (user?.name == ("senior sub admin")) {
      //       user.name = 'Admin';
      //     }
      //     if (user?.name == ("sub admin")) {
      //       user.name = 'Sub admin';
      //     }
      //     if (user?.name.includes("super")) {
      //       user.name = 'Super Master ';
      //     }
      //     if (user?.name.includes("master")) {
      //       user.name = 'Master';
      //     }
      //   })
      // }

    });
    this.common.balance$.subscribe((balance) => {
      this.balance = balance;
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
  selectlanguage(newValue) {
    this.getLanguage();
    this.range = newValue;
    if (this.siteName == "cricBuzzer") {
      if (this.range == "sp") {
        // this.siteName = "cricbuzzer"

        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "pg") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('portuguese');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "tu") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('turkish');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');

      }
      else {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add(this.siteName);
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
    }
    this.tokenService.setLanguage(this.range);
  
  }
  getLanguage() {
    let L = []
    this.common.getlanguage().subscribe((resp: any) => {
      //console.log(resp);
      if(resp != null){
        this.language = resp
        this.language.forEach(data => {
          if (data.lang == this.range) {
            L.push(data)
          }
          this.Alllanguage = L  
          // console.log(this.Alllanguage);
          this.shareService.sharelanguage(this.Alllanguage[0]);
        })
      }
    })
  }
  lockallbets() {
    this.eventsService.Loackallbets().subscribe((res: any) => {
      this.betTransferStatus();
      if (res.errorCode == 0) {
        this.toastr.success(res.result[0].result);
      }
      else {
        this.toastr.error(res.result[0].result);
      }

    });
  }
  unlockallbets() {
    this.eventsService.Unlockallbets().subscribe((res: any) => {
      this.betTransferStatus();
      if (res.errorCode == 0) {
        this.toastr.success(res.result[0].result);
      }
      else {
        this.toastr.error(res.result[0].result);
      }
    });
  }
  lockTransfer() {
    this.eventsService.LockTransfer().subscribe((res: any) => {
      this.betTransferStatus();
      if (res.errorCode == 0) {
        this.toastr.success(res.result[0].result);
      }
      else {
        this.toastr.error(res.result[0].result);
      }

    });
  }
  unlockTransfer() {
    this.eventsService.UnlockTransfer().subscribe((res: any) => {
      this.betTransferStatus();
      if (res.errorCode == 0) {
        this.toastr.success(res.result[0].result);
      }
      else {
        this.toastr.error(res.result[0].result);
      }

    });
  }
  betTransferStatus() {
    this.eventsService.BetTransferStatus().subscribe((res: any) => {
      this.belock = res.result[0].betLock;
      this.transferLock = res.result[0].transferLock

    });
  }
  logout() {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.authService.logout();
      this.loadingService.setLoading(true);
      this.router.navigateByUrl('/login');
    }, (this.siteName == 'lc247') ? 1500 : 0);
    localStorage.removeItem('lastuser');
    this.toastr.success('Logged Out Successfully');
  }

  updateBalance() {
    this.isBalanceLoader = true;
    setTimeout(() => {
      this.common.updateBalance();
      this.isBalanceLoader = false;
    }, 1000);
  }

  closeSideBar() {
    this.isOpen = false;
  }

  clickedMenu() {
    // alert('clicked')
  }

  toggleSidebar() {
    this.isOpen = true;
    // this.compIntraction.setSidebar(this.isOpen);
    // console.log('header called');
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
