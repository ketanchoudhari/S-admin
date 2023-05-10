import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { IUserList } from 'src/app/users/models/user-list';
import { User } from 'src/app/users/models/user.model';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-betgameslist',
  templateUrl: './betgameslist.component.html',
  styleUrls: ['./betgameslist.component.scss']
})
export class BetgameslistComponent implements OnInit {
  productlist: any = [];
  productsdata: any = [];
  selectedUser: string = '';
  selectedTabIndex: number = 0;
  currentUser: CurrentUser;
  usersList: User[] = [];
  teenpattiSelectMap = {};
  whitelabelUserType: number;
  userid: number;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  productlist1: any = [];
  tpdata: any;
  Update: any;

  constructor(
    private sncasino: CasinoApiService,
    private authService: AuthService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private usersService: UsersService,
    public commonService: CommonService,
    private shareService: ShareDataService) { }


  ngOnInit(): void {
    this.getlanguages();
    this.currentUser = this.authService.currentUser;
    console.log(this.currentUser.userType)
    this.commonService.apis$.subscribe((res) => {
      this.CasinoProducts()
      this.listUser();
    })

    this.commonService.hierarchyMap$.subscribe((map) => {
      this.whitelabelUserType = this.commonService.whitelabelUserType;
      console.log(this.whitelabelUserType)
    });
    console.log(this.selectedUser)
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }
  listUser() {
    this.usersService
      .listUser(
        this.authService.currentUser.userId, undefined, 'active',
      )
      .subscribe((res: GenericResponse<IUserList[]>) => {
        if (res.errorCode === 0) {
          this.usersList = res.result[0].users;

          this.loadingService.setLoading(false);
        }
      });
  }

  listAllUsers() {
    for (let i = this.currentUser.userType + 1; i < 7; i++) {
      this.usersService
        .listUser(this.authService.currentUser.userId, i)
        .subscribe((res: GenericResponse<IUserList[]>) => {
          if (res.errorCode === 0) {
            this.usersList = this.usersList.concat(res.result[0].users);
            this.loadingService.setLoading(false);
          }
        });
    }
  }

  ActivateCasinoProducts() {
    if (
      this.currentUser.userType === this.commonService.vrnlUserType &&
      this.selectedUser) {
      const params = {
        userId: this.selectedUser,
        providers: Object.keys(this.teenpattiSelectMap)
          .filter((k) => this.teenpattiSelectMap[k])
          .reduce((a, c) => {
            return [...a, c];
          }, []),
      };

      //  console.log(
      //   params,
      //   Object.values(this.teenpattiSelectMap).filter((v) => v).length
      // );

      this.sncasino
        .ActivateBGCasinoGames(params)
        .subscribe((res: GenericResponse<any>) => {
          if (res.errorCode === 0) {
            this.toastr.success('product Updated');
            this.loadingService.setLoading(false);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else if (
      // this.currentUser.userType === this.commonService.whitelabelUserType &&
      // Object.values(this.teenpattiSelectMap).filter((v) => v).length
      this.currentUser.userType === this.commonService.whitelabelUserType
    ) {
      const params = {
        userId: this.selectedUser,
        providers: Object.keys(this.teenpattiSelectMap)
          .filter((k) => this.teenpattiSelectMap[k])
          .reduce((a, c) => {
            return [...a, c];
          }, []),
      };

      //  console.log(params, params.products.length);

      this.sncasino
        .ActivateBGCasinoGames(params)
        .subscribe((res: GenericResponse<any>) => {
          if (res.errorCode === 0) {
            this.toastr.success('products Updated');
            this.loadingService.setLoading(false);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      if (this.currentUser.userType === this.commonService.vrnlUserType) {
        this.toastr.error('Please select user and at least one product');
      }
      else {

        this.toastr.error('Please select atleast one product');
      }
    }
  }
  CasinoProducts() {
    this.loadingService.setLoading(true);
    this.sncasino.ListBGCasinoGames().subscribe((res: any) => {

      if (res && res.errorCode === 0) {
        this.productlist = res.result;
        this.productlist.forEach(
          (t) => (this.teenpattiSelectMap[t.name] = false)
        );
        console.log(this.productlist);
        this.loadingService.setLoading(false);

      }
    })
  }

  onChange(userid) {
    // this.productlist=[]
    // this.productlist1=[]

    // console.log(this.selectedUser)
    // console.log(userid)
    // if(!userid){
    //   return
    // }
    this.teenpattiSelectMap = []
    this.sncasino.UserlistBGCasinoGames(userid).subscribe((res: any) => {
      // console.log(res)

      if (res && res.errorCode === 0) {
        this.productlist1 = res.result
        this.productlist.forEach(
          (t) => (this.teenpattiSelectMap[t.name] = false)
        );
        this.productlist.forEach((data) => {
          // data.activeStatus = false;
          // console.log(this.productlist)
          this.productlist1.forEach((element) => {
            if (data.id == element.id) {
              this.productlist.forEach(
                (t) => (this.teenpattiSelectMap[element.name] = true)
              );
            }
            else {
              // data.activeStatus=false
            }
          })

        })

        // console.log(this.teenpattiSelectMap)


      }
    })
  }
  toggleSelectAll(checked) {
    // console.log(checked)
    console.log(this.teenpattiSelectMap)

    if (Object.values(this.teenpattiSelectMap).every((v) => v)) {
      Object.keys(this.teenpattiSelectMap).forEach(
        (k) => (this.teenpattiSelectMap[k] = checked)
      );
    } else {
      Object.keys(this.teenpattiSelectMap).forEach(
        (k) => (this.teenpattiSelectMap[k] = checked)
      );
    }
  }
  selectTab(tabIndex) {
    this.selectedTabIndex = tabIndex;
  }

}