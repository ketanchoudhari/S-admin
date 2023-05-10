import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { ShareDataService } from '../services/share-data.service';
import { CurrentUser } from '../shared/models/current-user';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  currentUser: CurrentUser;
  isPremiumSite = environment.isPremiumSite;
  isRental=environment.isRental;
  isBdlevel = environment.isBdlevel;
  Update: any;
  constructor(private authService: AuthService,private shareService: ShareDataService) { }

  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    // console.log(this.currentUser);
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
