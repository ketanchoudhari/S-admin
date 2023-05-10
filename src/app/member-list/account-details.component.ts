import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ShareDataService } from '../services/share-data.service';
import { ShareUserService } from '../services/share-user.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  currentUser: CurrentUser;
  userId: number;
  user: User;
  showMenu: boolean = false;
  userType: number;
  isClient: boolean = false;
  internationalCasino = environment.internationalCasino;
  isSupernova = environment.isSupernova;
  isSlot=environment.isSlot;
  isPremiumSite = environment.isPremiumSite;
  isbetgame=environment.isbetgame;
  isAWCcasino=environment.isAWCcasino;
  Update: any;
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private shareUserService: ShareUserService,
    private commonService: CommonService,
    private authService: AuthService,
    private shareService: ShareDataService
  ) {}

  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    this.userId = +this.route.snapshot.params.selectedUid;
    this.commonService.apis$.subscribe((res) => {
      this.getUser();
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
  getUser() {
    this.usersService
      .getUser(this.userId)
      .subscribe((res: GenericResponse<User[]>) => {
        if (res.errorCode === 0) {
          this.user = res.result[0];
          // this.userType = this.user.userType;
          this.isClient =
            this.user.userType === this.commonService.clientUserType;
          this.shareUserService.setUser(this.user);
        }
      });
  }
}
