import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { MessagesService } from '../messages.service';
import { MessagesTicker, NewTickerResponse } from '../models/ticker.model';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit {
  isAddNewModalOpen = false;
  tickers = [];
  isEditModalOpen = false;
  editTicker: MessagesTicker = {
    ticker: undefined,
    active: false,
  };
  newTicker: MessagesTicker = {
    ticker: undefined,
    active: false,
  };
  selectedItems = [];
  isAllTickersSelected = false;
  Update: any;

  constructor(
    private messagesService: MessagesService,
    private commonService: CommonService,
    private shareService: ShareDataService
  ) {}

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.listTicker();
    });
    this.getlanguages()
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }
  onSelectAllTickers(event): void {
    this.selectedItems = [];
    if (event.target.checked) {
      this.isAllTickersSelected = true;
      for (let {} of this.tickers) {
        this.selectedItems.push(true);
      }
    } else {
      this.isAllTickersSelected = false;
    }
  }

  onSelectTicker(id: number): void {
    this.selectedItems[id] = !this.selectedItems[id];
  }

  openAddNewModal(): void {
    this.isAddNewModalOpen = true;
    this.newTicker = {
      ticker: undefined,
      active: false,
    };
  }

  openEditModal(id: number): void {
    this.editTicker = Object.assign({}, this.tickers[id]);
    this.editTicker.id = id;
    this.isEditModalOpen = true;
  }

  confirmEdit(): void {
    this.tickers[this.editTicker.id] = this.editTicker;
    this.isEditModalOpen = false;
    this.updateTickers(this.tickers);
  }

  deleteTickers(): void {
    const newTickers = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      const item = this.selectedItems[i];
      if (!item) {
        newTickers.push(this.tickers[i]);
      }
    }
    this.tickers = newTickers;
    this.updateTickers(this.tickers);
  }

  addTicker(): void {
    this.tickers.push(this.newTicker);
    this.updateTickers(this.tickers);
  }

  updateTicker(id: number) {
    this.tickers[id].active = !this.tickers[id].active;
    this.updateTickers(this.tickers);
  }

  updateTickers(tickers: MessagesTicker[]): void {
    const newtickers = tickers.map((ticker) => ({
      ticker: btoa(ticker.ticker),
      active: ticker.active,
    }));
    this.messagesService
      .changeTickers(newtickers)
      .subscribe((res: GenericResponse<NewTickerResponse>) => {
        if (res.errorCode === 0) {
          this.isAddNewModalOpen = false;
          this.listTicker();
        }
      });
  }

  listTicker(): void {
    this.messagesService
      .listTickers()
      .subscribe((res: GenericResponse<MessagesTicker[]>) => {
        if (res.errorCode === 0) {
          this.tickers = res.result.map((ticker) => ({
            ticker: atob(ticker.ticker),
            active: ticker.active,
          }));
          this.selectedItems = new Array(this.tickers.length).fill(false);
          this.isAllTickersSelected = false;
        }
      });
  }
}
