import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ShareDataService } from 'src/app/services/share-data.service';
import { UserSearchService } from 'src/app/services/user-search.service';
import { Theme } from 'src/app/theme/symbols';
export interface Displaynm {
  userName: string;
  userType: number;
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  searchField: FormControl;
  searchKey: string;
  activeTheme: Theme;
  isShowSearchbox: boolean = true;
  Update: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userSearch: UserSearchService,
    private shareService: ShareDataService
  ) {}

  trackOfRoute: any[] = [];

  ngOnInit(): void {
    this.getlanguages();
    if (
      this.router.url.includes('claccountstatement') ||
      this.router.url.includes('accountSummary') ||
      this.router.url.includes('profitAndLoss') ||
      this.router.url.includes('bettingHistory') ||
      this.router.url.includes('transactionCashHistory') ||
      this.router.url.includes('loginHistory') ||
      this.router.url.includes('alluser')
    ) {
      this.isShowSearchbox = false;
    } else {
      this.isShowSearchbox = true;
    }
    this.router.events.subscribe((val) => {
      if (
        this.router.url.includes('claccountstatement') ||
        this.router.url.includes('accountSummary') ||
        this.router.url.includes('profitAndLoss') ||
        this.router.url.includes('bettingHistory') ||
        this.router.url.includes('transactionCashHistory') ||
        this.router.url.includes('loginHistory') ||
        this.router.url.includes('alluser')
      ) {
        this.isShowSearchbox = false;
      } else {
        this.isShowSearchbox = true;
      }
    });

    this.searchField = new FormControl();
    this.searchField.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.userSearch.searchUserApi(term);
      });

    this.route.queryParamMap.subscribe((params) => {
      if (params.has('searchKey')) {
        this.searchKey = params.get('searchKey');
      } else {
        this.searchKey = '';
      }
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
  searchUser(term: string) {
    this.userSearch.searchUser(term);
  }

  log(a: any) {
  //  console.log(a);
  }

  trackByBreadcrumb(index: number, route: any) {
    // if (route) {
    //   let strd = (<any>Object.values(route)[0]).userName;
    // //  console.log(strd, 'strd wjbibcw');
    //   this.addIn1Array(strd);
    // }
  }

  addIn1Array(str: any) {
    if (str && !this.trackOfRoute?.includes(str)) {
      this.trackOfRoute.push(str);
      localStorage.setItem('route', String(this.trackOfRoute));
    }
  }


}
