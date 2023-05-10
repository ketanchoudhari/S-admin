import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss']
})
export class AccountSummaryComponent implements OnInit {

  currentUser: CurrentUser;
  balance: number = 0;
  currencyCode: string;
  fixCurrency = environment?.currency;
  showCurrency=environment?.showCurrency;
  Update: any;
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private shareService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    this.commonService.balance$.subscribe((balance) => {
      this.balance = balance;
    })
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }

}
