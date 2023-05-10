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
  selector: 'app-slotlist',
  templateUrl: './slotlist.component.html',
  styleUrls: ['./slotlist.component.scss']
})
export class SlotlistComponent implements OnInit {
  productlist: any = [];
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
  cat1: any = [];
  cat: number[] = [];
  constructor(private casino: CasinoApiService,
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

  ActivateCasinoCategories() {
    if (
      this.currentUser.userType === this.commonService.vrnlUserType &&
      this.selectedUser) {
      const params = {
        userId: this.selectedUser,
        categories: Object.keys(this.teenpattiSelectMap)
          .filter((k) => this.teenpattiSelectMap[k])
          .reduce((a, c) => {
            return [...a, c];
          }, []),
      };

      //  console.log(
      //   params,
      //   Object.values(this.teenpattiSelectMap).filter((v) => v).length
      // );

      this.casino
        .ActivateCasinoCategories(params)
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
        categories: Object.keys(this.teenpattiSelectMap)
          .filter((k) => this.teenpattiSelectMap[k])
          .reduce((a, c) => {
            return [...a, c];
          }, []),
      };

      //  console.log(params, params.products.length);

      this.casino
        .ActivateCasinoCategories(params)
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
    this.casino.ListCasinoCategories().subscribe((res: any) => {

      if (res && res.errorCode === 0) {
        res.result.forEach(
          (t) => (this.teenpattiSelectMap[t] = false)
        );
        // console.log(this.teenpattiSelectMap);
        this.productlist = res.result;
        var i = 0
        this.productlist.forEach((element) => {
          element.games.forEach((t) => {
            (this.teenpattiSelectMap[t.name] = false)
          })

        })
        // this.productlist.push({ status: res.result, value: false });
        // this.productlist.push(this.productlist[i].activeStatus = false); 
        console.log(this.productlist)
        this.loadingService.setLoading(false);

      }
    })
  }
  // onChange(userid) {
  //   // this.productlist=[]
  //   // this.productlist1=[]

  //   // console.log(this.selectedUser)
  //   // console.log(userid)
  //   // if(!userid){
  //   //   return
  //   // }
  //   this.teenpattiSelectMap = []
  //   this.casino.userCasinoCategories(userid).subscribe((res: any) => {
  //     // console.log(res)

  //     if (res && res.errorCode === 0) {
  //       this.productlist1 = res.result
  //       this.productlist.forEach(
  //         (element) =>
  //           element.games.forEach((t) =>
  //             (this.teenpattiSelectMap[t.name] = false)
  //           )
  //       );
  //       this.productlist.forEach((datat) => {
  //         datat.games.forEach((data) => {
  //           // data.activeStatus = false;
  //           // console.log(this.productlist)
  //           this.productlist1.forEach((element) => {
  //             if (data.id == element.id) {
  //               this.productlist.forEach(
  //                 element.games.forEach((t) =>
  //                   (this.teenpattiSelectMap[t.name] = true)
  //                 )
  //               );
  //             }
  //             else {
  //               // data.activeStatus=false
  //             }
  //           })
  //         })

  //       })

  //       // console.log(this.teenpattiSelectMap)


  //     }
  //   })
  // }
  onChange(userid) {
    // this.productlist=[]
    // this.productlist1=[]

    // console.log(this.selectedUser)
    // console.log(userid)
    // if(!userid){
    //   return
    // }
    this.teenpattiSelectMap = []
    this.casino.userCasinoCategories(userid).subscribe((res: any) => {
      // console.log(res)

      if (res && res.errorCode === 0) {
        this.productlist1 = res.result
        this.productlist.forEach(
          (t) => (this.teenpattiSelectMap[t.category] = false)
        );
        this.productlist.forEach((data) => {
          // data.activeStatus = false;
          // console.log(this.productlist)
          this.productlist1.forEach((element) => {
            if (data.category == element.category) {
              this.productlist.forEach(
                (t) => (this.teenpattiSelectMap[element.category] = true)
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
  onChangecat(cat) {
    //   this.cat = []
    //  console.log(cat)
    //   if (event.target.checked) {
    //     this.cat.push(cat);
    //   }
    console.log(cat)
    this.teenpattiSelectMap = []
    this.productlist.forEach(
      (element) =>
        element.games.forEach((t) =>
          (this.teenpattiSelectMap[element.category] = false)
        )
    );
    this.productlist.forEach((datat) => {
        cat.forEach((e, index) => {
          // console.log(datat.category,e,"")
          if (datat.category == e) {
              datat.games.forEach((t) =>
                (this.teenpattiSelectMap[datat.category] = true)
              )
          }
        })

    })

    console.log(this.teenpattiSelectMap)



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
