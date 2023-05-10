import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';
import { ITimeSelectConfig } from 'ng2-date-picker/time-select/time-select-config.model';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { AuthService } from 'src/app/services/auth.service';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ExportService } from 'src/app/services/export-as.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { environment } from 'src/environments/environment';
import { ReportsService } from '../reports.service';
import { IDownlinePL } from '../types/downline-pl';
import * as html2pdf from 'html2pdf.js'
import { User } from 'src/app/users/models/user.model';
import { IUserList } from 'src/app/users/models/user-list';
import { UsersService } from 'src/app/users/users.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-pl-casino',
  templateUrl: './pl-casino.component.html',
  styleUrls: ['./pl-casino.component.scss']
})

export class PlCasinoComponent implements OnInit, OnDestroy {
  currentUser?: CurrentUser;
  usersList: User[];
  selectedUser: string = '';
  selectedoperatorId:string='';
  fromDate;
  fromTime;
  toDate;
  toTime;
  totalRow: any;
  dateConfig: IDayTimeCalendarConfig;
  fromDateConfig: IDayTimeCalendarConfig;
  timeConfig: ITimeSelectConfig;
  totalStake: any = 0;
  totalDownlinePl: any = 0;
  totalComm: any = 0;
  totalUplinePL: any = 0;
  totalOwnPl: any = 0;
  totalplayerGrossPL:any = 0;
  totalplayerPL:any = 0;
  totPNL:any = 0;
  totStake:any = 0;
  tabIndex:number=0;
  operatorsMap=[{
    name:"vrnl",currency:"USD"
  },{
    name:"vrnl",currency:"HKD"
  },{
    name:"wsky",currency:"INR"
  }]

  downlineList: IDownlinePL[] = [];
  downlineListHolder: IDownlinePL[] = [];
  toTimeinput: boolean = false;
  p: number = 1;
  n: number = 25;
  ownData: { commission: number; ownPL: number };
  onlyNameAndSymbolArr: {
    uid: string;
    stake: number;
    playerPL: number;
    DownlinePL: number;
    comm: number;
    UplinePL: number;
    OwnPL: number;
  }[];

  subSink = new Subscription();
  isInTransit: boolean;
  maindatacsv: any[];
  profit: number;
  loss: number;
  isVrnladmin: boolean = false;
  // plWLreport=wlrepoortjson
  siteName = environment.siteName;
  isPremiumSite = environment.isPremiumSite;
  isRental=environment.isRental;
  isBdlevel = environment.isBdlevel;
  internationalCasino=environment.internationalCasino;
  month;
  etglist: any = [];
  etglistCount: any = 0;
  selectPagelimit = "10";
  prevousCount: number;
  userId: number=this.currentUser?.userId;
  Update: any;
  constructor(
    private usersService: UsersService,
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private loadingService: LoadingService,
    public commonService: CommonService,
    private authService: AuthService,
    private exportwaService: ExportService,
    private envService: EnvService,
    private casino: CasinoApiService,
    private shareService: ShareDataService
  ) {
    this.toTimeinput = this.envService.environment.toTimeinput;
    this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
    if(this.siteName === 'betswiz'){
      this.dateConfig = {
        format: 'YYYY-MM-DD'
      };
    }else{
      this.dateConfig = {
        format: 'YYYY-MM-DD',
        min: this.month,
      };
    }


    this.fromDate = datePipe.transform(
      new Date().setDate(new Date().getDate() - 1),
      'yyyy-MM-dd'
    );
    this.fromTime = datePipe.transform(
      new Date().setHours(0, 0, 0),
      'HH:mm:ss'
    );


    this.toDate = datePipe.transform(new Date().setDate(new Date().getDate()), 'yyyy-MM-dd');
    if (this.toTimeinput) {
      this.toTime = datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
    } else {
      this.toTime = datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
    }

    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };
  }
  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    this.commonService.apis$.subscribe((res) => {
      // this.getDownlinePL();
      // this.casinoPlReportByDownLine();
    });
    // console.log(this.plWLreport);
    this.commonService.hierarchyMap$.subscribe((map) => {

      if (this.currentUser.userType === this.commonService.vrnlUserType) {
        this.isVrnladmin = true;
      }
      this.listUser();



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
  // selectNoRows(numberOfRows: number) {
  //   this.p = 1;
  //   this.n = +numberOfRows;
  // }
  getdownlinedata(){
    this.reportsService.casinoPlReportByDownLine((this.selectedUser !== "")?this.selectedUser:this.currentUser?.userId,
      `${this.fromDate} ${this.fromTime}`,
      `${this.toDate} ${this.toTime}`)
      .subscribe((res: any) => {
        this.maindatacsv = res.result[0]
        console.log(this.maindatacsv);


      })
  }
  listUser() {
    this.usersService
      .listUser(
        this.currentUser.userId,undefined,'active',
      )
      .subscribe((res: GenericResponse<IUserList[]>) => {
        if (res.errorCode === 0) {
          this.usersList = res.result[0].users;
          this.loadingService.setLoading(false);
        }
      });
  }
  casinoPlReportByDownLine(){
    if (!this.isInTransit) {
      this.isInTransit = true;
    }
    let user = {
      ownPL: 0,
      downLinePL: 0,
      upLinePL: 0,
      commission: 0
    };
    this.loadingService.setLoading(true);
    let casinoPlReportByDownLine = this.reportsService.casinoPlReportByDownLine((this.selectedUser !== "")?this.selectedUser:this.currentUser?.userId,
      `${this.fromDate} ${this.fromTime}`,
      `${this.toDate} ${this.toTime}`)
      .pipe(finalize(() => (this.isInTransit = false)))
      .subscribe((res: GenericResponse<any[]>) => {
        this.maindatacsv = res.result[0]
        // console.log(this.maindatacsv);


        this.loadingService.setLoading(false);
        if (res.errorCode === 0) {
          res.result[0].sort((a, b) => a.userType - b.userType);
          res.result[0].forEach((user) => {
            user.downLine = res.result[0].filter((usr) => {
              return user.userId == usr.parentId;
            })
          })
          res.result[0] = res.result[0].filter((usr) => {
            return this.currentUser.userId == usr.parentId;
          })


          this.downlineList = PlCasinoComponent.addShowDownline(
            res.result[0]

          );
          this.downlineListHolder = PlCasinoComponent.addShowDownline(
            res.result[0]
          );
          this.ownData = res.result[1];
          this.totalStake = 0;
          this.totalDownlinePl = 0;
          this.totalComm = 0;
          this.totalUplinePL = 0;
          this.totalOwnPl = 0;
          this.totalplayerGrossPL = 0;
          this.totalplayerPL = 0;
          this.downlineList.forEach((x) => {
            this.totalStake += x.stake;
            this.totalDownlinePl += x.downLinePL;
            this.totalComm += x.commision;
            this.totalUplinePL += x.upLinePL;
            this.totalOwnPl += x.ownPL;
            this.totalplayerGrossPL += x.playerGrossPL;
            this.totalplayerPL += x.playerPL;
          });
        }
        // this.totalRow = res.result[0].reduce((acc, c) => {
        //   acc.ownPL += c.ownPL;
        //   acc.downLinePL += c.downLinePL;
        //   acc.upLinePL += c.upLinePL; 
        //   acc.commission += c.commision; 
        //   return acc;
        // }, user);
        // console.log(this.totalRow);
        this.exportFiles();
      });
    this.subSink.add(casinoPlReportByDownLine);
  }
  private static addShowDownline(downline: IDownlinePL[]) {
    return downline.map((downline) => {
      downline.showDownline = false;
      PlCasinoComponent.addShowDownline(downline.downLine);
      return downline;

    });
  }


  toggleExpand(event, id: any, length: number) {
    for (let i = 0; i <= length; i++) {
      let state = document.getElementById(id + i)?.style.display;
      if (state === 'none') {
        let el = document.getElementById(id + i);
        if (el) {
          document.getElementById(id + i).style.display = 'table-row';
          event.target.className = 'expand-open';
        }
      } else {
        let el = document.getElementById(id + i);
        if (el) {
          document.getElementById(id + i).style.display = 'none';
          event.target.className = 'expand-close';
        }
      }
    }
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
      if (this.toTimeinput) {
        this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
      } else {
        this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
      }
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
      if (this.toTimeinput) {
        this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
      } else {
        this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
      }
    }
    if(this.tabIndex == 0){
      this.casinoPlReportByDownLine();
    }else{
      this.EtgCasino();
    }
  }

  toggleShowDownline(player) {
    player.showDownline = !player.showDownline;
    //console.log(player.downLine)

  }
  getgreenred(e: any) {
    if (e == 0) {
      this.profit = 0
      //console.log("green",this.profit)

    }
    else {
      this.loss = 1
      //console.log("red",this.loss)
    }
  }

  udt;
  edata = [];
  exportFiles() {
    // edata = [];
    this.udt = {
      data: [
        { A: 'User Data' }, // title
        {
          A: 'UserName',
          B: 'stake',
          C: 'playerGrossPL',
          D: 'PlayerNetPL',
          E: 'DownlinePL',
          F: 'comm.',
          G: 'UplinePL',
          H: 'OwnPL',
        }, // table header
      ],
      skipHeader: true,
    };
    this.downlineList.forEach((x) => {
      this.udt.data.push({
        A: x.userName,
        B: String(x.stake),
        C: String(x.playerGrossPL),
        D: String(x.playerPL),
        E: String(x.downLinePL),
        F: String(x.commision),
        G: String(x.upLinePL),
        H: String(x.ownPL),
      });
    });
    this.edata.push(this.udt);
    //  console.log(this.edata, 'edata after changes');
    //return;
    // this.exportwaService.
  }

  exportExcel() {
    this.udt = {
      data: [
        { A: 'User Data' }, // title
        {
          A: 'UserName',
          C: 'playerGrossPL',
          D: 'PlayerNetPL',
          E: 'DownlinePL',
          F: 'comm.',
          G: 'UplinePL',
          H: 'OwnPL',
        }, // table header
      ],
      skipHeader: true,
    };
    this.downlineListHolder.forEach((x) => {
      this.udt.data.push({
        A: x.userName,
        C: x.playerGrossPL,
        D: x.playerPL,
        E: x.downLinePL,
        F: x.commision,
        G: x.upLinePL,
        H: x.ownPL,
      });
    });
    this.udt.data.push({
      A: 'Total',
      E: this.totalDownlinePl,
      F: this.totalComm,
      G: this.totalUplinePL,
      H: this.totalOwnPl,
    });
    this.edata.push(this.udt);
    //  console.log(this.edata, 'edata after changes');
    //  console.log(this.edata.slice(-1), 'edata after changes');
    //  console.log(this.edata, 'edata after changes');

    let name =
      'pl-casino' +
      String(this.fromDate).replace('-', '').replace('-', '') +
      ' - ' +
      String(this.toDate).replace('-', '').replace('-', '');
    this.exportwaService.exportJsonToExcel(this.edata.slice(-1), name);
  }
  exportCsv() {
    let csvdata = []

    let col = [
      'userName',
      'playerGrossPL',
      'playerPL',
      'downLinePL',
      'commision',
      'upLinePL',
      'ownPL',
    ];
    let name =
      'pl casino' +
      String(this.fromDate).replace('-', '').replace('-', '') +
      ' - ' +
      String(this.toDate).replace('-', '').replace('-', '');

    this.exportwaService.exportToCsv(this.maindatacsv, name, col);
    // console.log(this.maindatacsv)
  }

  exportPdf() {
    var element = document.getElementById('table_DL');
    var opt = {
      margin: 1,
      filename: 'PLCasino.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }

  tabChangeFunction(tabindex){
    this.tabIndex = tabindex;
    if(this.tabIndex == 0){
      this.fromTime = this.datePipe.transform(new Date().setHours(0, 0, 0),'HH:mm:ss');
      this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
      this.casinoPlReportByDownLine();
    }else{
      this.fromTime = this.datePipe.transform(new Date().setHours(0, 0, 0),'HH:mm:ss');
        this.toTime = this.datePipe.transform(new Date().setHours(23, 59, 59), 'HH:mm:ss')
      this.EtgCasino();
    }
  }


  EtgCasino() {
    this.loadingService.setLoading(true);
    // var formatUTCfromDateObj = new Date(`${this.fromDate} ${this.fromTime}`).getTime() - new Date(this.fromDate).getTimezoneOffset()*60*1000;
    // var formatUTCtoDateObj = new Date(`${this.toDate} ${this.toTime}`).getTime() - new Date(this.toDate).getTimezoneOffset()*60*1000;
    // let fromDate = this.datePipe.transform(new Date(formatUTCfromDateObj),'yyyy-MM-dd');
    // let fromTime = this.datePipe.transform(new Date(formatUTCfromDateObj), 'HH:mm:ss');
    // let toDate = this.datePipe.transform(new Date(formatUTCtoDateObj), 'yyyy-MM-dd');
    // let toTime = this.datePipe.transform(new Date(formatUTCtoDateObj), 'HH:mm:ss');
    // console.log(formatUTCfromDateObj,formatUTCtoDateObj);
    
    this.casino.ETGCasinopnl(  
       `${this.fromDate} ${this.fromTime}`,
    `${this.toDate} ${this.toTime}`,this.p, this.n,(this.selectedUser !== "")?this.selectedUser:this.currentUser?.userId,this.selectedoperatorId).subscribe((res: any) => {
      this.etglist = res.result;
      res.result.sort((a, b) => a.totPNL - b.totPNL);
      // this.etglist = res.result.reverse().map((pnl) => {
      //   var totalpnl = 0;

      //   pnl.pnlsByEvent.forEach((bet) => {
      //     totalpnl += +bet.pnl;

      //   });
      //   pnl.totalpnl = totalpnl;
      //   return pnl;
      // });
      this.totPNL = 0;
      this.totStake = 0;
      this.etglist?.forEach((user: any) => {
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
        this.totPNL += user.totPNL;
        this.totStake += user.totalStake;
      })
      if (this.etglistCount != this.prevousCount) {
        this.selectPagelimit = "10";
      }
      this.loadingService.setLoading(false);
    })
  }
  toggleCasinoExpand(event, id: any) {
    let state = document.getElementById(id).style.display;
    if (state === 'none') {
      document.getElementById(id).style.display = 'table-row';
      event.target.className = 'expand-open';
    } else {
      document.getElementById(id).style.display = 'none';
      event.target.className = 'expand-close';
    }
  }
  toggleExpand1(event, id: any) {
    let state = document.getElementById(id).style.display;
    if (state === 'none') {
      document.getElementById(id).style.display = 'table-row';
      event.target.className = 'expand-open';
    } else {
      document.getElementById(id).style.display = 'none';
      event.target.className = 'expand-close';
    }
  }
  filterBybetId(term?: string) {
    this.p=1;
    // this.EtgCasino()
  }
  selectNoRows(numberOfRows: number) {
    this.p = 1;
    this.n = +numberOfRows;
    if(this.tabIndex == 1){
      this.EtgCasino();
    }
  }

  public counter(i: number) {
    if (i && typeof i == 'number') return new Array(i);
  }
  pageChanged(event) {
    this.p = event;
  }
  trackByIndex(index) {
    return index;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
    this.loadingService.setLoading(false);
  }


}
