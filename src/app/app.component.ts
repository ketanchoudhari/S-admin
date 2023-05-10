import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { ShareDataService } from './services/share-data.service';
import { IApis } from './shared/types/apis';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Admin';
  isPremiumSite= environment.isPremiumSite;
  oldAdmin = environment.oldAdmin;
  userdata: any;

  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private auth: AuthService,
    private titleCase: TitleCasePipe,
    private router: Router,
    private SharedateService: ShareDataService,
    private readonly meta: Meta
  ) {

    // this.meta.removeTag('name="viewport"');

    if (this.oldAdmin) {
      // timer(500).subscribe(() => {
        this.meta.removeTag('name="viewport"');
        this.meta.addTag({ name: 'viewport', content: 'width=1200' })
      // })
    }
    let user = this.SharedateService.Userdata$.subscribe((resp) => {
      if (resp) {
        this.userdata = resp;
        // console.log(this.userdata)
      }
      })


    this.commonService.getApis().subscribe((res: IApis) => {

      let devEnv =
        window.location.origin.includes("cricbuzzer") ||  window.location.origin.includes("dreamcric247") || window.location.origin.includes("velkibuzzer") || window.location.origin.includes("winplus247") || 
        window.location.origin.includes("localhost1");

      if (devEnv) {
        res.adminIp = res.ssladmin;
      } else {
        res.adminIp = res.adminIp;
        // if (location.protocol === 'https:') {
          res.adminIp = res.ssladmin;
        // }
      }
      // console.log(res);

      this.commonService.apis$.next(res);
    });
  }

  ngOnInit() {
    this.commonService.getApis();
    if (this.auth.checkIsLoggedIn()) {
      this.commonService.apis$.subscribe((res) => {
        // console.log(res);
        this.commonService.loadfullHierarchy();
        this.commonService.listHierarchy();
        this.commonService.listAllHierarchy();
        this.commonService.updateBalance();
        this.commonService.apis = res;
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.commonService.hierarchyMap$.subscribe((list) => {
          this.titleService.setTitle(
            this.titleCase.transform(
              list.get(this.auth.currentUser.userType).name
            )
          );
        });
      } else {
        this.titleService.setTitle('Admin');
      }
    });
  }
}
