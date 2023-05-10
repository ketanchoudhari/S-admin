import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { IUserList } from '../users/models/user-list';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { TeenpattiService } from './teenpatti.service';
import { ICasinoMarket } from './types/casino-table';

@Component({
  selector: 'app-teenpatti',
  templateUrl: './teenpatti.component.html',
  styleUrls: ['./teenpatti.component.scss'],
})
export class TeenpattiComponent implements OnInit {
  selectedTabIndex: number = 0;
  selectedUser: string = '';
  currentUser: CurrentUser;
  usersList: User[] = [];
  teenpattiLists: ICasinoMarket[];

  teenpattiSelectMap = {};

  whitelabelUserType: number;

  constructor(
    private teenpattiService: TeenpattiService,
    private usersService: UsersService,
    private auth: AuthService,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    this.commonService.apis$.subscribe((res) => {
      this.getTeenpattiList();
      this.listUser();
    });

    this.commonService.hierarchyMap$.subscribe((map) => {
      this.whitelabelUserType = this.commonService.whitelabelUserType;
    });
  }

  getTeenpattiList() {
    this.teenpattiLists = [];
    this.loadingService.setLoading(true);
    this.teenpattiService
      .listTeenpatti()
      .subscribe((res: GenericResponse<ICasinoMarket[]>) => {
        if (res && res.errorCode === 0) {
          res.result.forEach(
            (t) => (this.teenpattiSelectMap[t.tableName] = false)
          );
           console.log(this.teenpattiSelectMap);

          this.teenpattiLists = res.result;

          this.loadingService.setLoading(false);
        }
      });
  }

  listUser() {
    this.usersService
      .listUser(
        this.auth.currentUser.userId,undefined,'active',
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
        .listUser(this.auth.currentUser.userId, i)
        .subscribe((res: GenericResponse<IUserList[]>) => {
          if (res.errorCode === 0) {
            this.usersList = this.usersList.concat(res.result[0].users);
            this.loadingService.setLoading(false);
          }
        });
    }
  }

  selectTab(tabIndex) {
    this.selectedTabIndex = tabIndex;
  }

  onActiveCasino() {
    if (
      this.currentUser.userType === this.commonService.vrnlUserType &&
      this.selectedUser ) {
      const params = {
        userId: this.selectedUser,
        tables: Object.keys(this.teenpattiSelectMap)
          .filter((k) => this.teenpattiSelectMap[k])
          .reduce((a, c) => {
            return [...a, c];
          }, []),
      };

      //  console.log(
      //   params,
      //   Object.values(this.teenpattiSelectMap).filter((v) => v).length
      // );

      this.teenpattiService
        .activeCasino(params)
        .subscribe((res: GenericResponse<any>) => {
          if (res.errorCode === 0) {
            this.toastr.success('Tables Updated');
            this.loadingService.setLoading(false);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else if (
      this.currentUser.userType === this.commonService.whitelabelUserType &&
      Object.values(this.teenpattiSelectMap).filter((v) => v).length
    ) {
      const params = {
        tables: Object.keys(this.teenpattiSelectMap)
          .filter((k) => this.teenpattiSelectMap[k])
          .reduce((a, c) => {
            return [...a, c];
          }, []),
      };

      //  console.log(params, params.tables.length);

      this.teenpattiService
        .activeCasino(params)
        .subscribe((res: GenericResponse<any>) => {
          if (res.errorCode === 0) {
            this.toastr.success('Tables Updated');
            this.loadingService.setLoading(false);
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      if (this.currentUser.userType === this.commonService.vrnlUserType) {
        this.toastr.error('Please select user and at least one table');
      } else {
        
        this.toastr.error('Please select atleast one table');
      }
    }
  }

  toggleSelectAll(checked) {
    if (Object.values(this.teenpattiSelectMap).every((v) => v)) {
      Object.keys(this.teenpattiSelectMap).forEach(
        (k) => (this.teenpattiSelectMap[k] = false)
      );
    } else {
      Object.keys(this.teenpattiSelectMap).forEach(
        (k) => (this.teenpattiSelectMap[k] = true)
      );
    }
  }
}
