import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { GenericResponse } from '../shared/types/generic-response';
import { SettlementService } from './settlement.service';
import { IBMMarket } from './types/bm-market';
import { ISettleMarket } from './types/settle-market';
import { IVirtualCricket } from './types/virtual-cricket';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss'],
})
export class SettlementComponent implements OnInit {
  matchDate;
  matchTime;
  dateConfig;
  timeConfig;

  sportsEventIds = [
    { name: 'Soccer', id: '1' },
    { name: 'Tennis', id: '2' },
    { name: 'Cricket', id: '4' },
    { name: 'Teenpatti/ X-Games', id: 'casino' },
    { name: 'Horse Racing', id: '7' },
    { name: 'Greyhound Racing', id: '4339' },
    { name: 'Virtual Games', id: '-1012' },
    { name: 'TNPL BM', id: '1040' },
    { name: 'Kabbaddi', id: '52' },
  ];
  selectedSport: { name: string; id: string } = this.sportsEventIds[0];

  marketList: ISettleMarket[];
  selectedMarket: ISettleMarket;

  getListCalls = new Subject();
  virtualGames: IVirtualCricket[];

  panelsStatusMap = {};
  isConfirmVoidOpen: boolean = false;
  bmMarkets: IBMMarket[];
  Kabaddigames=[];
  month;
  constructor(
    private settlementService: SettlementService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.month =   datePipe.transform(new Date().setDate(new Date().getDate() - 90), 'yyyy-MM-dd');
    this.dateConfig = {
      format: 'YYYY-MM-DD',
      min: this.month,
    };
    this.timeConfig = {
      hours24Format: 'hh',
      showSeconds: true,
    };

    this.matchDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.matchTime = datePipe.transform(
      new Date().setHours(0, 0, 0),
      'HH:mm:ss'
    );
  }

  ngOnInit(): void { }

  getGames() {
    if (+this.selectedSport.id == -1012) {
      this.getVirtualGames();
    } else if (+this.selectedSport.id == 1040) {
      this.getTNPLBmMarkets();
    }else if (+this.selectedSport.id == 52) {
      this.getkabaddimarkets();
    } else {
      this.getListCalls.next();
      this.settlementService
        .closedGames(`${this.matchDate}`, this.selectedSport.id)
        .pipe(delay(1500), takeUntil(this.getListCalls))
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res.errorCode == 0) {
            this.resetMarketList();
            this.marketList = res.result;
            this.toastr.success('Success');
          } else {
            this.toastr.error('Something went wrong');
          }
        });
    }
  }

  getVirtualGames() {
    this.settlementService
      .getVirtual(`${this.matchDate}`)
      .subscribe((res: GenericResponse<IVirtualCricket[]>) => {
        //  console.log(res);
        this.resetMarketList();
        this.virtualGames = res.result;
      });
  }

  getkabaddimarkets(){
    this.settlementService
      .getkabaddiGames(`${this.matchDate}`)
      .subscribe((res: GenericResponse<IVirtualCricket[]>) => {
        //  console.log(res);
        this.resetMarketList();
        this.Kabaddigames = res.result;
      });
  }

  settleMarket() {
    this.settlementService
      .setResult(this.selectedMarket.sportId, this.selectedMarket.marketId)
      .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
        if (res.errorCode == 0) {
          this.toastr.success('Market Settled');
        } else {
          this.toastr.error('Something went wrong');
        }
      });
  }

  getTNPLBmMarkets() {
    this.settlementService
      .getBmMarkets(`${this.matchDate}`)
      .subscribe((res: GenericResponse<IBMMarket[]>) => {
        //  console.log(res);
        this.resetMarketList();
        this.bmMarkets = res.result;
      });
  }

  get24HrsDate(startTime) {
    const [date, time, a] = startTime.split(' ');

    let time12h = time + ' ' + a;

    // console.log(this.convertDate(date));


    // console.log(this.convertTime12to24(time12h));

    startTime = this.convertDate(date) + 'T' + this.convertTime12to24(time12h);

    // console.log(startTime)
    return startTime;
    // return ;
  }

  convertDate(date) {
    let [mm, dd, yyyy] = date.split('/');

    if (mm < 10) {
      mm = 0 + '' + mm;
    }

    if (dd < 10) {
      dd = 0 + '' + dd;
    }

    return `${yyyy}-${mm}-${dd}`;
  }

  convertTime12to24(time12h) {
    let [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    if (hours < 10) {
      hours = 0 + '' + hours;
    }

    return `${hours}:${minutes}:00Z`;
  }

  confirmVoid() {
    this.isConfirmVoidOpen = true;
  }

  voidMarket() {
    this.settlementService
      .voidBets(this.selectedMarket.marketId)
      .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
        if (res.errorCode == 0) {
          this.toastr.success('Market Bets Voided');
        } else {
          this.toastr.error('Something went wrong');
        }
      });
  }

  selectSport(sport) {
    this.selectedSport = sport;
  }

  selectMarket(market) {
    this.selectedMarket = market;
  }

  settleBook(marketId, selectionId) {
    //  console.log(marketId, selectionId);
    this.settlementService
      .settleVirtual('bookmaker', marketId, selectionId)
      .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
        if (res.errorCode == 0) {
          this.toastr.success(res.errorDescription || 'Settled Bookmaker');
          this.getVirtualGames();
        } else {
          this.toastr.error(res.errorDescription || 'Something went wrong');
        }
      });
  }

  settleTNPLBm(marketId, selectionId) {
    this.settlementService
      .settleTNPLBmMarket(marketId, selectionId)
      .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
        if (res.errorCode == 0) {
          this.toastr.success(res.errorDescription || 'Settled Bookmaker');
          this.getTNPLBmMarkets();
        } else {
          this.toastr.error(res.errorDescription || 'Something went wrong');
        }
      });
  }

  settlekabaddi(marketId, selectionId) {
    this.settlementService
      .settleKabaddiGames('bookmaker',marketId, selectionId)
      .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
        if (res.errorCode == 0) {
          this.toastr.success(res.errorDescription || 'Settled Kabaddi Bookmaker');
          this.getkabaddimarkets();
        } else {
          this.toastr.error(res.errorDescription || 'Something went wrong');
        }
      });
  }

  settleFancy(marketId, runs) {
    //  console.log(marketId, runs);
    this.settlementService
      .settleVirtual('fancy', marketId, runs)
      .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
        if (res.errorCode == 0) {
          this.toastr.success(res.errorDescription || 'Settled Fancy');
          this.getVirtualGames();
        } else {
          this.toastr.error(res.errorDescription || 'Something went wrong');
        }
      });
  }

  resetMarketList() {
    this.marketList = [];
    this.virtualGames = [];
    this.bmMarkets = [];
  }

  splitSelectionNames(eventName: string) {
    eventName=eventName.replace(' V ',' v ');
    if (eventName.split(' v ').length < 2) {
      return eventName.split(' vs ');
    } else {
      return eventName.split(' v ');
    }
  }

  closeVoidModal() {
    this.isConfirmVoidOpen = false;
  }

  trackByMarketId(index, item) {
    return item.marketId;
  }

  trackByEventId(index, item) {
    return item.eventId;
  }

  trackByGameId(index, item) {
    return item.gameId;
  }
}
