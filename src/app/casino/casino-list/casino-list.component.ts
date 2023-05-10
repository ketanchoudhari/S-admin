import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ShareUserService } from 'src/app/services/share-user.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-casino-list',
  templateUrl: './casino-list.component.html',
  styleUrls: ['./casino-list.component.scss']
})
export class CasinoListComponent implements OnInit {
  casinoList: any = [];
  isLogin: boolean = false;
  dropdownMenu: any=[];
  constructor(
    private casino: CasinoApiService,
    private common: CommonService,

  ) {

  }

  ngOnInit(): void {
    this.dropdownMenu = [
      { routingLink: "teenpatti/teenpatti-twenty",gtype:"teen20", tableId: "-11",tableName: "TP2020",},
      { routingLink: "teenpatti/oneday",gtype:"teen", tableId: "-12", tableName: "TP1Day" },
      { routingLink: "teenpatti/tpopen",gtype:"teen8",tableId: "-14", tableName: "TPOpen" },
      { routingLink: "teenpatti/lucky7-a",gtype:"lucky7", tableId: "-10", tableName: "Lucky7A"},
      { routingLink: "teenpatti/lucky7-b",gtype:"lucky7eu", tableId: "-10",  tableName: "Lucky7B"},
      { routingLink: "teenpatti/thirty-two-card-a",gtype:"card32", tableId: "-24",  tableName: "32Cards" },
      { routingLink: "teenpatti/thirty-two-card-b",gtype:"card32eu", tableId: "-25",  tableName: "32CardsB" },
      { routingLink: "teenpatti/baccarate",gtype:"baccarat", tableId: "-9",  tableName: "Baccarat" },
      { routingLink: "teenpatti/threecardjud",gtype:"3cardj", tableId: "-23",tableName: "3CardsJud" },
      { routingLink: "teenpatti/aaa",gtype:"aaa", tableId: "-26",  tableName: "AAA"},
      { routingLink: "teenpatti/bollywood",gtype:"btable",tableId: "-27",tableName: "Bollywood"},
      { routingLink: "teenpatti/poker2020",gtype:"poker20", tableId: "-20",  tableName: "Poker2020"},
      { routingLink: "teenpatti/poker1day",gtype:"poker",tableId: "-19",  tableName: "Poker1Day" },
      { routingLink: "teenpatti/poker6p",gtype:"poker6", tableId: "-18",   tableName: "Poker6P" },
      { routingLink: "teenpatti/dt2020",gtype:"dt20", tableId: "-6", tableName: "DT2020" },
      { routingLink: "teenpatti/dt1day",gtype:"dt6", tableId: "-7",  tableName: "DT1Day" },
      { routingLink: "teenpatti/dtl2020",gtype:"dtl20", tableId: "-8", tableName: "DTL2020"},


    


    ];
    this.common.apis$.subscribe((res) => {
      this.listCasinoTable()

    });
  }

  listCasinoTable() {
    this.casino.listTeenpatti().subscribe((resp: any) => {
      this.casinoList = resp.result;
      console.log(this.casinoList);

    });
  }

  trackByFn(item, index) {
    return item.matchId;
  }

}
